{% include "gti_eg_education/public/js/follow_up.js" %}

frappe.provide('gti_education')
frappe.provide('gti_education.answers')

const set_question_answer = (frm, cdt, cdn) => {
	let row = frappe.get_doc(cdt, cdn)
	if (!row.question_link)
		return;
	get_answers(row.question_link).then(val=>{
		frappe.meta.get_docfield("Lead Questionnaires", "answer", frm.doc.name).options = val;
		frm.fields_dict.questionnaires.grid.refresh();
	})
}

const get_answers = question =>{ return new Promise ((resolve, reject)=>{
	if (!gti_education.answers[question]) {
		frappe.db.get_doc('Question', question).then(doc=>{
			gti_education.answers[question] = doc.options.map(op=>{
				return op.option
			})
			resolve(gti_education.answers[question])
		})
	}else {
		resolve(gti_education.answers[question])
	}
})}

frappe.ui.form.on("Lead Questionnaires", {
	question_link: (frm, cdt, cdn) => {
		set_question_answer(frm, cdt, cdn)
	},
	answer: (frm, cdt, cdn) => {
		set_question_answer(frm, cdt, cdn)
	}
})


// Make Student.
frappe.ui.form.on('Lead', {
	refresh: frm=>{
		if (!frm.doc.__islocal && !frm.doc.organization_lead) {
			frm.add_custom_button(__("Student"), frm.events.make_student, __("Create"))
		}
	},
	make_student: frm =>{
		if (typeof frm==="undefined")
			frm = cur_frm;
		if (!frm.$student_dialog) {
			frm.$student_dialog = new frappe.ui.Dialog({
				title: __("Make Student"),
				fields: [
					{
						label: __("Student Group"),
						fieldname: "student_group",
						fieldtype: "Link",
						options: "Student Group"
					},
					{
						label: __("Program"),
						fieldname: "program",
						fieldtype: "Link",
						options: "Program"
					},
					{
						label: __("Student Category"),
						fieldname: "student_category",
						fieldtype: "Link",
						options: "Student Category",
						depneds_on: "program"
					},
					{
						label: __("Course"),
						fieldname: "course",
						fieldtype: "Link",
						options: "Course",
						depneds_on: "program"
					},
					{
						label: __("School House (School)"),
						fieldname: "school_house",
						fieldtype: "Link",
						options: "School House",
						depneds_on: "program"
					}
				],
				primary_action: values => {
					frappe.call({
						method: "gti_eg_education.utils.lead.make_student",
						args: Object.assign(values,frm.doc),
						callback: r => {
							if (!r.xhr)
								frappe.msgprint(__("Student Created"))
						}
					})
					frm.$student_dialog.hide()
				}
			})
		}
		frm.$student_dialog.show()
	}
})
