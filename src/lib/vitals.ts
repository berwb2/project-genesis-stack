
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

function reportWebVitals(metric: Metric) {
  // This function can be expanded to send data to an analytics endpoint.
  // For now, we'll just log to the console.
  console.log('[Web Vitals]', metric);
}

export function startReportingWebVitals() {
  onCLS(reportWebVitals);
  onINP(reportWebVitals);
  onFCP(reportWebVitals);
  onLCP(reportWebVitals);
  onTTFB(reportWebVitals);
}
