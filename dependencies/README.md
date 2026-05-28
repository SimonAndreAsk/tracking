# Dependencies

Maps analytics contracts to downstream systems (dashboards, GA4, pixels, warehouses, etc.).

## Files

| File | Purpose |
|------|---------|
| [`dashboard-manifest.json`](dashboard-manifest.json) | Protected telemetry keys — CI and automation should fail if these are removed or renamed without approval |

When you add a contract field or event that a report or tag depends on, add the key to the manifest so breaking changes are caught before merge.
