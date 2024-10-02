"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { SetStateAction, JSX, SVGProps, useState, useRef, useEffect } from "react";
import { Toaster, toast } from 'sonner';

const phoneNumberId = process.env.NEXT_PUBLIC_VAPI_PHONE_ID;
const assistantId =  process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

export default function PhoneInputForm() {
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState(Array(10).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCountrySelect = (code: SetStateAction<string>) => {
    setCountryCode(code);
  };

  const handlePhoneNumberChange = (value: string, index: number) => {
    if (!/^[0-9]$/.test(value)) {
      return;
    }
    const newPhoneNumber = [...phoneNumber];
    newPhoneNumber[index] = value;
    setPhoneNumber(newPhoneNumber);

    // Move focus to the next input field
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newPhoneNumber = [...phoneNumber];
      if (newPhoneNumber[index]) {
        newPhoneNumber[index] = "";
        setPhoneNumber(newPhoneNumber);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newPhoneNumber[index - 1] = "";
        setPhoneNumber(newPhoneNumber);
      }
    }
  };

  const validatePhoneNumber = (number: any[]) => {
    return number.every((digit: string) => /^[0-9]$/.test(digit));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const strippedPhoneNumber = countryCode + phoneNumber.join('').replace(/\s+/g, '');
    if (validatePhoneNumber(phoneNumber)) {
      setError("");
      makeCall(strippedPhoneNumber);
      toast.success(`Dialing ${strippedPhoneNumber}`);
      console.log(`Phone number: ${strippedPhoneNumber}`);
    } else {
      setError("Please enter a valid 10-digit phone number.");
    }
  };

  const makeCall = async (number : string) => {
    console.log("Making phone call");
    const response = await fetch('/api/vapi/make-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumberId: phoneNumberId,
        assistantId:  assistantId,
        customerNumber: number,
      }),
    });
  
    const result = await response.json();
    console.log(result);
  };

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, phoneNumber.length);
  }, [phoneNumber.length]);

  return (
    <>
      <Toaster position="bottom-right" /> {/* Add the Toaster component */}
      <form onSubmit={handleSubmit} className="mx-auto px-2 items-center">
        <p className="mb-2">Enter your phone number to get called by Vapi Blocks.</p>
        <div className="flex items-center space-x-2 mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-center w-full sm:w-auto hidden sm:flex" style={{ borderRadius: 0 }}>
                <span>{countryCode}</span>
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full p-2">
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleCountrySelect("+1")}>
                  <span>+1 United States</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCountrySelect("+1")}>
                  <span>+1 Canada</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCountrySelect("+44")}>
                  <span>+44 United Kingdom</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative flex-1 flex space-x-1 phone-input-container">
            {phoneNumber.map((digit, index) => (
              <React.Fragment key={index}>
                <Input
                  type="text"
                  value={digit}
                  onChange={(e) => handlePhoneNumberChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                  className="w-8 px-2 text-center phone-input"
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  style={{ borderRadius: 0 }} // Makes the input rectangular
                />
                {(index === 2 || index === 5) && <span className="dash">-</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <Button type="submit" size="sm" className="w-full" style={{ borderRadius: 0 }}>
          Submit
        </Button>
      </form>
      <style jsx>{`
        .phone-input-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dash {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .phone-input + .dash {
          margin: 0 2px;
        }
      `}</style>
    </>
  );
}

function ChevronDownIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
