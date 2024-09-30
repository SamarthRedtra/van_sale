import { useFrappeGetDoc } from "frappe-react-sdk";
import { POSInvoice } from "../../../utils/types";
import { formatDate } from "../../../utils/formatDate";
import { ClockIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { format, parse } from "date-fns";

interface InvoiceDetailCardProps {
  posInvoice: string;
}

export default function InvoiceDetailCard({
  posInvoice,
}: InvoiceDetailCardProps) {
  const { data: pos_invoice } = useFrappeGetDoc<POSInvoice>(
    "POS Invoice",
    posInvoice
  );
  return (
    <div className="bg-white rounded-lg shadow m-4">
      <div className="flex gap-4 justify-between items-start border border-gray-200 p-2 rounded-t-md">
        <div className="flex flex-col flex-1 justify-between items-start">
          <a
            className="flex gap-2 items-center text-blue-500 underline font-medium"
            href={`/app/pos-invoice/${pos_invoice?.name}`}
          >
            <span>{pos_invoice?.name ?? "-"}</span>
            <ExternalLinkIcon />
          </a>
        </div>
      </div>
      <div className="flex text-sm">
        <div className="flex p-2 w-28 rounded-bl-md flex-col gap-1.5 border border-gray-200">
          <p className="flex items-center gap-1 text-sm">
            <ClockIcon color="#00f" />
            <span>Date</span>
          </p>
          <span className="font-semibold">
            {formatDate(pos_invoice?.due_date ?? "")}
          </span>
        </div>
        <div className="flex p-2 flex-col gap-1.5 border border-gray-200">
          <p className="flex items-center gap-1 text-sm">
            <ClockIcon color="#00f" />
            <span>Time</span>
          </p>
          <span className="font-semibold">
            {pos_invoice?.posting_time &&
              format(
                parse(
                  pos_invoice?.posting_time?.split(".")[0] ?? "",
                  "HH:mm:ss",
                  new Date()
                ),
                "HH:mm"
              )}
          </span>
        </div>
        <div className="flex p-2 rounded-br-md justify-between items-center flex-1 border border-gray-200">
          <div className="flex flex-col gap-1.5">
            <p className="flex items-center gap-1 text-sm">
              <span>Amount</span>
            </p>
            <span className="font-semibold">
              {pos_invoice?.paid_amount ?? "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
