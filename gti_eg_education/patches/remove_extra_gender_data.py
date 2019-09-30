import frappe


def execute():
	for g in frappe.get_all("Gender", {"name": ("not in", ("Male", "Female"))}):
		frappe.delete_doc("Gender", g)
