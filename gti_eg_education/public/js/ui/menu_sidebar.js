frappe.provide('gti_eg')

$(document).ready(function(){
	new MenuSidebar()
})

class MenuSidebar {
	constructor () {
		this.$wrapper = $(`<aside>`).prependTo('#body_div')
		this.$wrapper.html("Hello")
		this.render_root_menu()
	}
	render_root_menu () {
		if(!gti_eg['menu']) {
			this.get_root_menu('', 1).then(results => {
				gti_eg['menu'] = results
				this.render_parent_menu()
			})
		}else {
			this.render_parent_menu()
		}
	}
	render_parent_menu () {
		gti_eg.menu.forEach(menu=>{
			this.$wrapper[menu.module_name] = $(`<li>`).html(menu.module_name).appendTo(this.$wrapper)
		})
	}
	get_root_menu (parent, is_root) {
		return new Promise((resolve, reject)=>{
			frappe.call({
				"method": "gti_eg_education.utils.menu.get_menu",
				args: {
					is_root: is_root,
					parent: parent
				},
				callback: r => {
					if (r['message']) {
						resolve(r.message)
					}else {
						reject(r.xhr)
					}
				}
			})
		})
	}
}