import frappe
from werkzeug.exceptions import HTTPException, NotFound
from werkzeug import Response


def check_subscription_suspension():    
    if frappe.get_site_config().van_subscription_suspended == 1:
        html = frappe.render_template("van_sale/templates/suspended_subscription.html")
        raise HTTPException("Suspended Subscription",Response(html, status=404, content_type="text/html"))

        
      
        