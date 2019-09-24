
frappe.ui.form.on('Follow Up', {
	demo_class_date: (frm, cdt, cdn) => {
		let row = frappe.get_doc(cdt, cdn)
		if (row.demo_class_date < frappe.datetime.now_date()) {
			row.demo_class_date = ''
			frappe.msgprint(__("Demo class date should not be before Today"))
			frm.refresh_field('communications')
		}
	},
	follow_up_date: (frm, cdt, cdn) => {
		let row = frappe.get_doc(cdt, cdn)
		if (row.follow_up_date < frappe.datetime.now_date()) {
			row.follow_up_date = ''
			frappe.msgprint(__("Follow Up date should not be before Today"))
			frm.refresh_field('communications')
		}
	}
})