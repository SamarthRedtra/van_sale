app_name = "van_sale"
app_title = "Bolt Distribution"
app_publisher = "info@redtra.com"
app_description = "Bolt Distribution (Van Sales)"
app_email = "info@redtra.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "van_sale",
# 		"logo": "/assets/van_sale/logo.png",
# 		"title": "Bolt Distribution",
# 		"route": "/van_sale",
# 		"has_permission": "van_sale.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = ["/assets/van_sale/css/delivery_trip.css"]
app_include_js = "/assets/van_sale/js/customer_quick_entry_form.js"

# include js, css files in header of web template
# web_include_css = "/assets/van_sale/css/van_sale.css"
# web_include_js = "/assets/van_sale/js/van_sale.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "van_sale/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
page_js = {"point-of-sale": "public/js/point_of_sale.js"}

# include js in doctype views
doctype_js = {
    "Delivery Trip": "public/js/delivery_trip.js",
    "POS Invoice": "public/js/pos_invoice.js",
    "Service Level Agreement": "public/js/sla.js",
}
doctype_list_js = {"Delivery Trip" : "public/js/delivery_trip_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "van_sale/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "van_sale.utils.jinja_methods",
# 	"filters": "van_sale.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "van_sale.install.before_install"
# after_install = "van_sale.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "van_sale.uninstall.before_uninstall"
# after_uninstall = "van_sale.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "van_sale.utils.before_app_install"
# after_app_install = "van_sale.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "van_sale.utils.before_app_uninstall"
# after_app_uninstall = "van_sale.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "van_sale.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

override_doctype_class = {
    "Vehicle": "van_sale.overrides.vehicle.VanSaleVehicle",
    "Warehouse": "van_sale.overrides.warehouse.VanSaleWarehouse",
    "Delivery Trip": "van_sale.overrides.delivery_trip.VanSaleDeliveryTrip",
    "POS Invoice": "van_sale.overrides.pos_invoice.VanSalePOSInvoice",
    "Customer": "van_sale.overrides.customer.CustomCustomer",
    "Contact": "van_sale.overrides.contact.CustomContact",
}

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"Warehouse": {
# 		"after_insert": "van_sale.bolt_distribution.controllers.warehouse.after_insert",
# 		"on_update": "van_sale.bolt_distribution.controllers.warehouse.on_update",
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"van_sale.tasks.all"
# 	],
# 	"daily": [
# 		"van_sale.tasks.daily"
# 	],
# 	"hourly": [
# 		"van_sale.tasks.hourly"
# 	],
# 	"weekly": [
# 		"van_sale.tasks.weekly"
# 	],
# 	"monthly": [
# 		"van_sale.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "van_sale.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "van_sale.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "van_sale.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["van_sale.utils.before_request"]
# after_request = ["van_sale.utils.after_request"]

# Job Events
# ----------
# before_job = ["van_sale.utils.before_job"]
# after_job = ["van_sale.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"van_sale.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

fixtures=[
    {'doctype':'Kanban Board'}
]

website_route_rules = [
    {"from_route": "/vansale/<path:app_path>", "to_route": "vansale"},
]
