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
