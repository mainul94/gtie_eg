frappe.provide('gti_eg')

$(document).ready(function(){
	new MenuSidebar()
})

class MenuSidebar {
	constructor () {
		this.$wrapper = $(`<aside>`).prependTo('#body_div')
		this.render_root_menu()
	}
	render_root_menu () {
		this.$root_menu_wrp = $(`<ul>`).addClass('left_menu list-group').appendTo(this.$wrapper)
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
		$.each(gti_eg['menu'], (key, rows)=>{
			this.$wrapper[key] = $(`<li class="list-group-item disabled">`).html(key).appendTo(this.$root_menu_wrp)
			rows.forEach(menu=>{
				this.$wrapper[key][menu.module_name] = $(`<li class="list-group-item" data-module="${menu.module_name}" data-render-children=0>`).html(this.get_root_item_html(menu)).appendTo(this.$root_menu_wrp)
				this.$wrapper[key][menu.module_name].hover(el=>{
					let $el = $(el.target)
					if (!$el.is('[data-render-children]'))
						return;
					if (parseInt($el.attr('data-render-children'))===0) {
						$($el).attr('data-render-children', 1)
						let $menu = $(`<ul class="menu loader list-group">`).appendTo($el)
						this.get_root_menu($($el).attr('data-module')).then(results=>{
							this.render_menu($menu, results.data)
							$menu.removeClass('loader')
						})
					}
				})
			})
		})
	}
	render_menu($parent, items) {
		items.forEach(rows=>{
			$parent.append(`<li class="list-group-item disabled">${rows.label}</li>`)
			rows.items.forEach(item=>{
				$parent.append(`<li class="list-group-item">${this.get_item_html(item)}</li>`)
			})
		})
	}
	get_item_html(module) {
		let $html = `<a  title="${module.label}" href="${this.get_link(module)}"><span title="${module.label}">
		${module.icon? '<i class="'+ module.icon +'"></i>': ""}
		${module.label}</a></span>`
		return $html
	}
	get_root_item_html(module) {
		let $html = `<span title="${module.label}">
		${module.icon? '<i class="'+ module.icon +'"></i>': ""}
		${module.label}<a  title="${module.label}" href="${this.get_link(module)}">
		<i class="fa fa-caret-right"></i>
		</a></span>`
		return $html
	}
	get_link(item) {
		if (item.type==="module"){
			return `#modules/${item.module_name}`
		}
		else if (item.type==="doctype") {
			if(!item.settings){
				return `#List/${item.name}`
			}else {
				return `#Form/${item.name}`
			}
		}
		else if (item.type==="report") {
			if (item.is_query_report) {
				return `#query-report/${item.name}`
			}else {
				return `#List/${item.doctype}/Report/${item.name}`
			}
		}
	}
	get_root_menu (parent, is_root) {
		return new Promise((resolve, reject)=>{
			let args = {
				parent: parent
			}
			if (is_root) {
				args['is_root'] = true
			}
			frappe.call({
				"method": "gti_eg_education.utils.menu.get_menu",
				args: args,
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