import frappe
from frappe.desk.moduleview import get_desktop_settings, get

@frappe.whitelist()
def get_menu(parent=None, is_root=False):
	if is_root:
		return get_desktop_settings().get('Modules')
	elif parent:
		return get(parent)