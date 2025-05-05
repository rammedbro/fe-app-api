import opentelemetry, { DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations, getResourceDetectors } from '@opentelemetry/auto-instrumentations-node';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { detectResources, resourceFromAttributes } from '@opentelemetry/resources';
import { ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor, ConsoleSpanExporter, NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { PrismaInstrumentation, registerInstrumentations } from '@prisma/instrumentation';
import Pyroscope from '@pyroscope/nodejs';
import process from 'node:process';

const {
  npm_package_name,
  npm_package_version,
  NODE_ENV = 'production',
  TRACE_DISABLED,
  METRIC_DISABLED,
  PROFILING_DISABLED,
  OTEL_EXPORTER_OTLP_ENDPOINT,
  OTEL_TRACES_EXPORTER,
  OTEL_METRICS_EXPORTER,
  OTEL_CUSTOM_ENABLED_INSTRUMENTATIONS,
  OTEL_LOG_LEVEL,
  PYROSCOPE_ENDPOINT,
} = process.env;

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: npm_package_name,
  [ATTR_SERVICE_VERSION]: npm_package_version,
  'deployment.environment': NODE_ENV,
}).merge(detectResources({ detectors: getResourceDetectors() }));

setLogger();
registerTrace();
registerMetric();
registerProfiling();
registerInstrumentations({
  instrumentations: [getNodeAutoInstrumentations(), getCustomInstrumentations()],
});

/**
 * Traces collecting
 * @see https://opentelemetry.io/docs/languages/js/instrumentation/#traces
 */
function registerTrace() {
  if (TRACE_DISABLED === 'true') return;

  const traceExporter = getTraceExporter();

  if (!traceExporter) return;

  const tracerProvider = new NodeTracerProvider({
    resource,
    spanProcessors: [new BatchSpanProcessor(traceExporter)],
  });

  tracerProvider.register({
    contextManager: getContextManager(),
  });
}

/**
 * Metric collecting
 * @see https://opentelemetry.io/docs/languages/js/instrumentation/#metrics
 */
function registerMetric() {
  if (METRIC_DISABLED === 'true') return;

  const metricReader = getMetricReader();

  if (!metricReader) return;

  const meterProvider = new MeterProvider({
    resource: resource,
    readers: [metricReader],
  });

  opentelemetry.metrics.setGlobalMeterProvider(meterProvider);
}

/**
 * Profiling
 * @see
 */
function registerProfiling() {
  if (PROFILING_DISABLED === 'true') return;

  const entries = resource
    .getRawAttributes()
    .filter(([, value]) => typeof value === 'string' || typeof value === 'number');
  const tags = Object.fromEntries(entries) as Record<string, string | number>;

  Pyroscope.init({
    serverAddress: PYROSCOPE_ENDPOINT,
    appName: npm_package_name,
    wall: {
      collectCpuTime: true,
    },
    tags,
  });

  Pyroscope.start();
}

function setLogger() {
  const logger = new DiagConsoleLogger();

  if (OTEL_LOG_LEVEL) {
    const level = OTEL_LOG_LEVEL.toUpperCase() as keyof typeof DiagLogLevel;
    opentelemetry.diag.setLogger(logger, DiagLogLevel[level]);
  }
}

function getContextManager() {
  return new AsyncHooksContextManager().enable();
}

function getTraceExporter() {
  switch (OTEL_METRICS_EXPORTER) {
    case 'otlp':
      return new OTLPTraceExporter({
        url: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
      });
    case 'console':
      return new ConsoleSpanExporter();
    default:
      return undefined;
  }
}

function getMetricReader() {
  switch (OTEL_TRACES_EXPORTER) {
    case 'otlp':
      return new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`,
        }),
      });
    case 'console':
      return new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
      });
    default:
      return undefined;
  }
}

function getCustomInstrumentations() {
  const instrumentations = [];
  const enabled = OTEL_CUSTOM_ENABLED_INSTRUMENTATIONS?.split(',');

  if (enabled?.includes('prisma')) {
    instrumentations.push(new PrismaInstrumentation({ middleware: true }));
  }

  return instrumentations;
}
