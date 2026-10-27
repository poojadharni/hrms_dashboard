frappe.pages['hrms_dashboard'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'HRMS Dashboard',
		single_column: true
	});
}