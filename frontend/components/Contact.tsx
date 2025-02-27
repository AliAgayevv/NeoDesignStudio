"use client";

import React from "react";
import SectionHeaderTitle from "./SectionHeaderTitle";
import { Montserrat } from "next/font/google";
import { IoCallOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";

import { useFormik } from "formik";
import * as Yup from "yup";

const contactElement = {
  az: {
    title: "Əlaqə",
    callUs: "Zəng edin",
    chatWithUs: "Bizim ilə söhbət edin",
    sendMessageViaEmail: "Bizə e-poçt göndərin",
    sendMessageViaInstagram: "Bizə İnstagramda mesaj göndərin",
    sendMessageViaWhatsapp: "Bizə Whatsappda mesaj göndərin",
    firstName: "Ad",
    firstNameEroro: "Adınızı daxil edin",
    surname: "Soyad",
    email: "E-poçt",
    emailError: "E-poçt daxil edin",
    phoneNumber: "Telefon nömrəsi",
    phoneNumberError: "Telefon nömrəsi daxil edin",
    invalidEmail: "Yanlış e-poçt ünvanı",
    message: "Mesaj",
    messageError: "Mesaj daxil edin",
    messageInner: "Bizə mesaj göndərin...",
    submit: "Göndər",
  },
  en: {
    title: "Contact",
    callUs: "Call us",
    chatWithUs: "Chat with us",
    sendMessageViaEmail: "Shoot us an email",
    sendMessageViaInstagram: "Message us on instagram",
    sendMessageViaWhatsapp: "Message us on whatsapp",
    firstName: "First Name",
    firstNameEroro: "First Name is required",
    surname: "Surname",
    email: "Email",
    emailError: "Email is required",
    invalidEmail: "Invalid email address",
    phoneNumber: "Phone Number",
    phoneNumberError: "Phone number is required",
    message: "Message",
    messageError: "Message is required",
    messageInner: "Leave us a message...",
    submit: "Submit",
  },
  ru: {
    title: "Контакт",
    callUs: "Позвоните нам",
    chatWithUs: "Поговорите с нами",
    sendMessageViaEmail: "Отправьте нам электронное письмо",
    sendMessageViaInstagram: "Отправьте нам сообщение в Instagram",
    sendMessageViaWhatsapp: "Отправьте нам сообщение в Whatsapp",
    firstName: "Имя",
    firstNameEroro: "Введите имя",
    surname: "Фамилия",
    email: "Электронная почта",
    invalidEmail: "Неверный адрес электронной почты",
    emailError: "Введите электронную почту",
    phoneNumber: "Номер телефона",
    phoneNumberError: "Введите номер телефона",
    message: "Сообщение",
    messageError: "Введите сообщение",
    messageInner: "Отправьте нам сообщение...",
    submit: "Отправить",
  },
};

const montserratFont600 = Montserrat({ subsets: ["latin"], weight: "600" });

interface subheaderTitleProps {
  children: React.ReactNode;
}

const SubheaderTitle: React.FC<subheaderTitleProps> = ({ children }) => {
  return <h3 className="subheader_text text-[#e7e7e6]">{children}</h3>;
};

const Contact = () => {
  const lang = useSelector(selectLanguage);

  const validationSchema = Yup.object({
    firstName: Yup.string().required(contactElement[lang].firstNameEroro),
    surname: Yup.string(),
    email: Yup.string()
      .email(contactElement[lang].invalidEmail)
      .required(contactElement[lang].emailError),
    phoneNumber: Yup.string()
      .matches(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$/,
        "070-123-45-67"
      )
      .required(contactElement[lang].phoneNumberError),
    message: Yup.string().required(contactElement[lang].messageError),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      surname: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://localhost:4000/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          alert("Form submitted !");
          formik.resetForm();
        } else {
          alert("Form submission failed !");
          console.log(response);
          console.log("Values: ", values);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="mx-auto h-[90000px] w-11/12">
      <SectionHeaderTitle>{contactElement[lang].title}</SectionHeaderTitle>
      <div
        className={`flex w-full flex-col justify-between md:flex-row ${montserratFont600.className}`}
      >
        <div className="w-6/12">
          <div className="gap- flex w-full flex-col">
            <SubheaderTitle>{contactElement[lang].callUs}</SubheaderTitle>
            <p className="text-[#e7e7e6]/50">
              Call our team Mon-fri from 10 am to 7pm
            </p>
            <p className="my-5 flex items-center gap-1.5">
              <IoCallOutline />
              <span>077711655</span>
            </p>
            <SubheaderTitle>{contactElement[lang].chatWithUs}</SubheaderTitle>
            <p className="mb-5 text-[#e7e7e6]/50">
              Speak to ur friendly team via live chat
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-0 text-[#E7E7E6] md:pt-10">
            <h3 className="uppercase underline underline-offset-4">
              {contactElement[lang].sendMessageViaEmail}
            </h3>
            <h3 className="uppercase underline underline-offset-4">
              {contactElement[lang].sendMessageViaInstagram}
            </h3>
            <h3 className="uppercase underline underline-offset-4">
              {contactElement[lang].sendMessageViaWhatsapp}
            </h3>
          </div>
        </div>
        <hr className="mx-auto mt-5 block" />
        <form className="mt-8 w-full md:w-1/2" onSubmit={formik.handleSubmit}>
          <div className="flex justify-between gap-2 md:gap-4">
            <div className="flex w-1/2 flex-col gap-4">
              <label>{contactElement[lang].firstName}</label>
              <input
                type="text"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={contactElement[lang].firstName}
                className="rounded-xl border border-[#e7e7e6]/50 bg-[#1e1e1e] p-3 text-[#e7e7e6]"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 text-sm">
                  {formik.errors.firstName}
                </div>
              )}
            </div>
            <div className="flex w-1/2 flex-col gap-4">
              <label>{contactElement[lang].surname}</label>
              <input
                type="text"
                name="surname"
                value={formik.values.surname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={contactElement[lang].surname}
                className="rounded-xl border border-[#e7e7e6]/50 bg-[#1e1e1e] p-3 text-[#e7e7e6]"
              />
              {formik.touched.surname && formik.errors.surname && (
                <div className="text-red-500 text-sm">
                  {formik.errors.surname}
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <label>{contactElement[lang].email}</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={contactElement[lang].email}
              className="w-full rounded-xl border border-[#e7e7e6]/50 bg-[#1e1e1e] p-3 text-[#e7e7e6]"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <label>{contactElement[lang].phoneNumber}</label>
            <input
              type="text"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={contactElement[lang].phoneNumber}
              className="w-full rounded-xl border border-[#e7e7e6]/50 bg-[#1e1e1e] p-3 text-[#e7e7e6]"
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 text-sm">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <label>{contactElement[lang].message}</label>
            <input
              type="text"
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={contactElement[lang].messageInner}
              className="w-full rounded-xl border border-[#e7e7e6]/50 bg-[#1e1e1e] p-3 text-[#e7e7e6]"
            />
            {formik.touched.message && formik.errors.message && (
              <div className="text-red-500 text-sm">
                {formik.errors.message}
              </div>
            )}
          </div>
          <button
            className="mt-10 w-40 ml-auto bg-[#e7e7e6] text-[#646060] md:hover:bg-[#646060] md:hover:text-[#e7e7e6] flex justify-center p-3 rounded-xl transition-all duration-300 ease-out"
            type="submit"
          >
            {contactElement[lang].submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
