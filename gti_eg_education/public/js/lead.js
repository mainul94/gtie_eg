{% include "gti_eg_education/public/js/follow_up.js" %}

frappe.ui.form.on("Lead", {
	onload: frm => {
		frm.questions = {}
		frappe.call({

		})
	}
})


const set_question_answer = (frm, cdt, cdn) => {

}