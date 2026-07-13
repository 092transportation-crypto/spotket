const methods = [
  {
    name: "Visa",
    mark: (
      <span className="text-[11px] font-extrabold italic tracking-tight text-[#1a1f71]">
        VISA
      </span>
    ),
  },
  {
    name: "Mastercard",
    mark: (
      <span className="flex" aria-hidden="true">
        <span className="h-4 w-4 rounded-full bg-[#eb001b]" />
        <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#f79e1b] mix-blend-multiply" />
      </span>
    ),
  },
  {
    name: "PayPal",
    mark: (
      <span className="text-[11px] font-extrabold italic tracking-tight">
        <span className="text-[#003087]">Pay</span>
        <span className="text-[#009cde]">Pal</span>
      </span>
    ),
  },
  {
    name: "Apple Pay",
    mark: (
      <span className="text-[11px] font-semibold tracking-tight text-black"> Pay</span>
    ),
  },
];

export default function PaymentIcons() {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
      {methods.map((method) => (
        <li
          key={method.name}
          title={method.name}
          className="flex h-8 w-12 items-center justify-center rounded-md bg-navy-900 shadow-sm"
        >
          <span className="sr-only">{method.name}</span>
          {method.mark}
        </li>
      ))}
    </ul>
  );
}
