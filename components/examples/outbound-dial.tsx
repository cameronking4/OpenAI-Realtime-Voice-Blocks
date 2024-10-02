"use client";

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import PhoneInput, { Value as E164Number, getCountryCallingCode, Country } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { Button } from "@/components/ui/button";
import { Input, InputProps } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toaster, toast } from 'sonner';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const phoneNumberId = process.env.NEXT_PUBLIC_VAPI_PHONE_ID;
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<React.ComponentProps<typeof PhoneInput>, "onChange"> & {
    onChange?: (value: E164Number | undefined) => void;
  };

const CustomPhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof PhoneInput>, PhoneInputProps>(
    ({ className, onChange, ...props }, ref) => {
      return (
        <PhoneInput
          ref={ref}
          className={cn("flex", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          onChange={(value) => onChange?.(value)}
          {...props}
        />
      );
    },
  );
CustomPhoneInput.displayName = "CustomPhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn("rounded-e-lg rounded-s-none", className)}
      {...props}
      ref={ref}
    />
  ),
);
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: Country;
  onChange: (value: Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: Country) => {
      onChange(country);
    },
    [onChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn("flex gap-1 rounded-e-none rounded-s-lg px-3")}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              "-mr-2 h-4 w-4 opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList>
            <ScrollArea className="h-72">
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-foreground/50 text-sm">
                          {`+${getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          option.value === value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: { country: Country; countryName: string }) => {
  const Flag = flags[country];

  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export default function PhoneInputForm() {
  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>(undefined);
  const [error, setError] = useState("");

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (phoneNumber && validatePhoneNumber(phoneNumber)) {
      setError("");
      makeCall(phoneNumber);
      toast.success(`Dialing ${phoneNumber}`);
      console.log(`Phone number: ${phoneNumber}`);
    } else {
      setError("Please enter a valid phone number.");
    }
  };

  const validatePhoneNumber = (number: string) => {
    return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g.test(number);
  };

  const makeCall = async (number: string) => {
    console.log("Making phone call");
    const response = await fetch('/api/vapi/make-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumberId: phoneNumberId,
        assistantId: assistantId,
        customerNumber: number,
      }),
    });

    const result = await response.json();
    console.log(result);
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <form onSubmit={handleSubmit} className="mx-auto px-2 items-center">
        <p className="mb-2">Receive phone call from Vapi Blocks.</p>
        <div className="flex items-center space-x-2 mb-2">
          <CustomPhoneInput
            className="w-full"
            value={phoneNumber}
            onChange={setPhoneNumber}
            defaultCountry="US"
            countries={['US', 'CA', 'GB']}  //add more countries using reference: https://www.npmjs.com/package/react-phone-number-input
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <Button type="submit" size="sm" className="w-full">
          Submit
        </Button>
      </form>
    </>
  );
}
