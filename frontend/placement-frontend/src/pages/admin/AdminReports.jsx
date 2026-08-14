import React, { useEffect, useState } from 'react';
import ReportTable from '../../components/admin/ReportTable';
import adminService from '../../services/adminService';

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState('overall'); // overall, company, department, year, drive
  const [reportData, setReportData] = useState([]);
  const [overallData, setOverallData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [activeTab]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      if (activeTab === 'overall') {
        const res = await adminService.getOverallReport();
        if (res.success) setOverallData(res.data);
      } else if (activeTab === 'company') {
        const res = await adminService.getCompanyReport();
        if (res.success) setReportData(res.data);
      } else if (activeTab === 'department') {
        const res = await adminService.getDepartmentReport();
        if (res.success) setReportData(res.data);
      } else if (activeTab === 'year') {
        const res = await adminService.getYearReport();
        if (res.success) setReportData(res.data);
      } else if (activeTab === 'drive') {
        const res = await adminService.getDriveReport();
        if (res.success) setReportData(res.data);
      }
    } catch (err) {
      console.error(`Failed to load ${activeTab} report:`, err);
    } finally {
      setLoading(false);
    }
  };

  // CSV Export Utility
  const handleExportCSV = (filename, columns, rows) => {
    if (!rows || rows.length === 0) {
      alert('No data available to export.');
      return;
    }
    const headers = columns.map((c) => `"${c.header}"`).join(',');
    const csvRows = rows.map((row) =>
      columns.map((c) => `"${row[c.accessor] ?? ''}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const tabs = [
    { id: 'overall', label: 'Overall Placement' },
    { id: 'company', label: 'Company-wise' },
    { id: 'department', label: 'Department-wise' },
    { id: 'year', label: 'Year-wise' },
    { id: 'drive', label: 'Drive-wise' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Placement Analytics & Reports</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Generate, review, and export comprehensive placement statistics across departments, companies, and academic years.
        </p>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem', flexWrap: 'wrap' }} className="no-print">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === t.id ? '#2563eb' : 'transparent',
              color: activeTab === t.id ? '#ffffff' : '#64748b',
              transition: 'all 0.2s ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Generating report analytics...</div>
      ) : (
        <>
          {/* Tab 1: Overall Placement Report */}
          {activeTab === 'overall' && overallData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Students</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginTop: '0.25rem' }}>{overallData.totalStudents}</div>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Eligible Students</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#2563eb', marginTop: '0.25rem' }}>{overallData.eligibleStudents}</div>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Students Placed</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#059669', marginTop: '0.25rem' }}>{overallData.studentsPlaced}</div>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Students Unplaced</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#e11d48', marginTop: '0.25rem' }}>{overallData.studentsNotPlaced}</div>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Placement Rate</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#06b6d4', marginTop: '0.25rem' }}>{overallData.placementPercentage}%</div>
                </div>
              </div>

              <ReportTable
                title="Overall Campus Placement Summary"
                columns={[
                  { header: 'Metric Category', accessor: 'category' },
                  { header: 'Count / Value', accessor: 'value' },
                ]}
                data={[
                  { category: 'Total Registered Students', value: overallData.totalStudents },
                  { category: 'Total Placement Eligible Students', value: overallData.eligibleStudents },
                  { category: 'Total Placed Students (Job Offers Confirmed)', value: overallData.studentsPlaced },
                  { category: 'Total Eligible Unplaced Students', value: overallData.studentsNotPlaced },
                  { category: 'Overall Campus Placement Percentage', value: `${overallData.placementPercentage}%` },
                ]}
                onExportCSV={() =>
                  handleExportCSV('overall_placement_report', [
                    { header: 'Category', accessor: 'category' },
                    { header: 'Value', accessor: 'value' },
                  ], [
                    { category: 'Total Registered Students', value: overallData.totalStudents },
                    { category: 'Total Placement Eligible Students', value: overallData.eligibleStudents },
                    { category: 'Total Placed Students', value: overallData.studentsPlaced },
                    { category: 'Total Eligible Unplaced Students', value: overallData.studentsNotPlaced },
                    { category: 'Placement Rate', value: `${overallData.placementPercentage}%` },
                  ])
                }
                onPrintPDF={handlePrintPDF}
              />
            </div>
          )}

          {/* Tab 2: Company-wise Report */}
          {activeTab === 'company' && (
            <ReportTable
              title="Company-wise Recruitment Report"
              columns={[
                { header: 'Company Name', accessor: 'companyName' },
                { header: 'Placement Drive Role', accessor: 'placementDrive' },
                { header: 'Total Applications', accessor: 'totalApplications' },
                { header: 'Shortlisted Candidates', accessor: 'shortlistedCount' },
                { header: 'Selected Candidates', accessor: 'selectedCount' },
              ]}
              data={reportData}
              onExportCSV={() =>
                handleExportCSV('company_wise_report', [
                  { header: 'Company', accessor: 'companyName' },
                  { header: 'Drive', accessor: 'placementDrive' },
                  { header: 'Applications', accessor: 'totalApplications' },
                  { header: 'Shortlisted', accessor: 'shortlistedCount' },
                  { header: 'Selected', accessor: 'selectedCount' },
                ], reportData)
              }
              onPrintPDF={handlePrintPDF}
            />
          )}

          {/* Tab 3: Department-wise Report */}
          {activeTab === 'department' && (
            <ReportTable
              title="Department-wise Placement Report"
              columns={[
                { header: 'Department / Branch', accessor: 'department' },
                { header: 'Total Students', accessor: 'totalStudents' },
                { header: 'Eligible Students', accessor: 'eligibleStudents' },
                { header: 'Selected Students', accessor: 'selectedStudents' },
                {
                  header: 'Placement Rate',
                  accessor: 'placementPercentage',
                  render: (val) => <span style={{ fontWeight: '700', color: '#059669' }}>{val}%</span>,
                },
              ]}
              data={reportData}
              onExportCSV={() =>
                handleExportCSV('department_wise_report', [
                  { header: 'Department', accessor: 'department' },
                  { header: 'Total', accessor: 'totalStudents' },
                  { header: 'Eligible', accessor: 'eligibleStudents' },
                  { header: 'Selected', accessor: 'selectedStudents' },
                  { header: 'Percentage', accessor: 'placementPercentage' },
                ], reportData)
              }
              onPrintPDF={handlePrintPDF}
            />
          )}

          {/* Tab 4: Year-wise Report */}
          {activeTab === 'year' && (
            <ReportTable
              title="Academic Year-wise Placement Report"
              columns={[
                { header: 'Academic Graduation Year', accessor: 'academicYear' },
                { header: 'Total Students', accessor: 'totalStudents' },
                { header: 'Selected Students', accessor: 'selectedStudents' },
                {
                  header: 'Placement Percentage',
                  accessor: 'placementPercentage',
                  render: (val) => <span style={{ fontWeight: '700', color: '#2563eb' }}>{val}%</span>,
                },
              ]}
              data={reportData}
              onExportCSV={() =>
                handleExportCSV('year_wise_report', [
                  { header: 'Academic Year', accessor: 'academicYear' },
                  { header: 'Total Students', accessor: 'totalStudents' },
                  { header: 'Selected', accessor: 'selectedStudents' },
                  { header: 'Placement Percentage', accessor: 'placementPercentage' },
                ], reportData)
              }
              onPrintPDF={handlePrintPDF}
            />
          )}

          {/* Tab 5: Drive-wise Report */}
          {activeTab === 'drive' && (
            <ReportTable
              title="Drive-wise Breakdown Report"
              columns={[
                { header: 'Company Name', accessor: 'company' },
                { header: 'Drive Job Title', accessor: 'drive' },
                { header: 'Applications', accessor: 'applications' },
                { header: 'Shortlisted', accessor: 'shortlisted' },
                { header: 'Selected', accessor: 'selected' },
                { header: 'Rejected', accessor: 'rejected' },
              ]}
              data={reportData}
              onExportCSV={() =>
                handleExportCSV('drive_wise_report', [
                  { header: 'Company', accessor: 'company' },
                  { header: 'Drive', accessor: 'drive' },
                  { header: 'Applications', accessor: 'applications' },
                  { header: 'Shortlisted', accessor: 'shortlisted' },
                  { header: 'Selected', accessor: 'selected' },
                  { header: 'Rejected', accessor: 'rejected' },
                ], reportData)
              }
              onPrintPDF={handlePrintPDF}
            />
          )}
        </>
      )}
    </div>
  );
}
