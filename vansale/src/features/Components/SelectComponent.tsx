import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectOptionType = {
  value: string;
  label: string;
};

interface SelectComponentProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOptionType[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  label?: string;
}

export function SelectComponent({
  onChange,
  options,
  value,
  //   className,
  //   disabled,
  label,
  placeholder,
}: //   required,
SelectComponentProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder || "Select"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
