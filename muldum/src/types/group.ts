import React from "react";

export const Groups = ["전공동아리", "네트워크", "자율동아리", "졸업작품"] as const;
export type GroupType = typeof Groups[number];

export const LockedGroups: readonly GroupType[] = ["자율동아리", "졸업작품"];

export interface GroupProps {
    active: GroupType | null;
    setActive: React.Dispatch<React.SetStateAction<GroupType | null>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export interface Errors {
  item: boolean;
  price: boolean;
  link: boolean;
  reason: boolean;
}

export interface FormInputProps {
    label: string;
    value: string;
    setValue: (val: string) => void;
    placeholder: string;
    width: string;
    error?: string | false;
    height?: string;
}

export interface ItemFormProps {
  item: string;
  setItem: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  link: string;
  setLink: (v: string) => void;
  reason: string;
  setReason: (v: string) => void;
  errors: { [key: string]: string };
  quantity: number;
  increase: () => void;
  decrease: () => void;
  handleSubmit: () => void;
  handleSecondary: () => void;
  FormInput: (props: FormInputProps & { height?: string }) => React.ReactElement;
}