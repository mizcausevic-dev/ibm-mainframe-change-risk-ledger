-- Board-readable IBM mainframe change-risk contract.
-- Replace example schema names with z/OS, SMF, DB2, change-calendar, and release-readiness exports.
select
  application_group,
  count(*) filter (where batch_window_compressed) as compressed_batch_windows,
  count(*) filter (where copybook_test_status <> 'validated') as untested_copybook_changes,
  100.0 * count(*) filter (where job_result = 'abend') / nullif(count(*), 0) as abend_rate_percent,
  count(*) filter (where jcl_last_reviewed_at < current_date - interval '180 day') as stale_jcl_jobs,
  count(*) filter (where artifact_type = 'db2_migration') as db2_change_count,
  max(current_date - rollback_drill_at) as rollback_drill_age_days
from ops.ibm_mainframe_change_events
where observed_at >= current_date - interval '30 day'
group by application_group;
