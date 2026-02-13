import type { Report, ReportReason } from './types'

const REPORTS_KEY = 'genevemap_reports'

function generateId(): string {
  return `rpt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function getReports(): Report[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveReports(reports: Report[]): void {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
}

export function addReport(
  resourceId: string,
  resourceName: string,
  reason: ReportReason,
  message: string
): Report {
  const report: Report = {
    id: generateId(),
    resource_id: resourceId,
    resource_name: resourceName,
    reason,
    message,
    status: 'pending',
    created_at: new Date().toISOString(),
  }
  const reports = getReports()
  reports.unshift(report)
  saveReports(reports)
  return report
}

export function resolveReport(reportId: string): void {
  const reports = getReports()
  const report = reports.find((r) => r.id === reportId)
  if (report) {
    report.status = 'resolved'
    report.resolved_at = new Date().toISOString()
    saveReports(reports)
  }
}

export function dismissReport(reportId: string): void {
  const reports = getReports()
  const report = reports.find((r) => r.id === reportId)
  if (report) {
    report.status = 'dismissed'
    report.resolved_at = new Date().toISOString()
    saveReports(reports)
  }
}

export function deleteReport(reportId: string): void {
  const reports = getReports().filter((r) => r.id !== reportId)
  saveReports(reports)
}

export function getReportCountForResource(resourceId: string): number {
  return getReports().filter((r) => r.resource_id === resourceId && r.status === 'pending').length
}

export const REPORT_REASONS: { value: ReportReason; labelFr: string; labelEn: string }[] = [
  { value: 'closed', labelFr: 'N\'existe plus', labelEn: 'No longer exists' },
  { value: 'wrong_info', labelFr: 'Informations incorrectes', labelEn: 'Wrong information' },
  { value: 'wrong_location', labelFr: 'Mauvaise adresse/localisation', labelEn: 'Wrong address/location' },
  { value: 'outdated', labelFr: 'Informations obsolètes', labelEn: 'Outdated information' },
  { value: 'duplicate', labelFr: 'Doublon', labelEn: 'Duplicate' },
  { value: 'other', labelFr: 'Autre', labelEn: 'Other' },
]
