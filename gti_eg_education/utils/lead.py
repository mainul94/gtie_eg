import frappe
from frappe import _
from frappe.utils import today
from erpnext.education.doctype.student_group.student_group import get_students
from frappe.model import optional_fields, default_fields

lead_to_student = {
	"lead_name":"first_name",
	"lead_name_ch": "last_name",
	"email_id": "student_email_id",
	"mobile_no": "student_mobile_number"
}


@frappe.whitelist()
def make_student(**kwargs):
	lead = kwargs.get('lead') or kwargs.get('name')
	if not lead:
		frappe.throw(_("Lead not found."))
	if frappe.db.exists("Student", {"lead": lead}):
		frappe.throw(_("Already created Student from this Lead."))
	student = frappe.new_doc('Student')
	student.set('student_type', 'Potential')
	student.set('lead', lead)
	for f in optional_fields + default_fields + ('__onload', '__last_sync_on', 'questionnaires', ''):
		if kwargs.get(f):
			del kwargs[f]
	student.update(kwargs)
	for lf, sf in lead_to_student.items():
		student.set(sf, kwargs.get(lf))
	if not student.student_email_id:
		student.student_email_id = "{}@example.com".format(lead)
	student.insert()
	if kwargs.get('program'):
		enroll_program = frappe.new_doc('Program Enrollment')
		enroll_program.update({
			'student': student.name,
			'program': kwargs.get('program'),
			'student_category': kwargs.get('student_category'),
			'school_house': kwargs.get('school_house'),
		})
		if kwargs.get('course'):
			courses = [{
				'course': kwargs.get('course')
			}]
		else:
			courses = [{"course": x. course} for x in frappe.get_doc('Program', kwargs.get('program')).courses]
		enroll_program.set('courses', courses)
		enroll_program.insert()
		enroll_program.submit()
	# Update Student Group
	if kwargs.get('student_group'):
		try:
			gr = frappe.get_doc('Student Group', kwargs.get('student_group'))
			students = get_students(gr.academic_year, gr.group_based_on, gr.academic_term, gr.program, gr.batch, gr.student_category, gr.course)
			st_dict = gr.as_dict().get('students', [])
			existing_students = [x.student for x in st_dict]
			for s in students:
				if not s.student in existing_students:
					st_dict.append(s)
			gr.set('students', st_dict)
			gr.save()
		except Exception:
			frappe.msgprint(_("Unabe to upate Student Group"))
	return True
