frappe.pages['hrms_dashboard'].on_page_load = function (wrapper) {
    frappe.ui.make_app_page({
        parent: wrapper,
        title: 'HRMS Dashboard',
        single_column: true
    });

    console.log('HRMS Dashboard page loaded');
};
