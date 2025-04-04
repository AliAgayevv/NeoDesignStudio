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
    callUsDetailed:
      "Komandamız həftənin bütün günləri saat 12:00-dan 22:00-dək zəngləriniz üçün əlçatandır.",
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
    callUsDetailed:
      "Our team is available for calls seven days a week from 12:00 PM to 10:00 PM.",
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
    submit: "Send",
  },
  ru: {
    title: "Контакт",
    callUs: "Позвоните нам",
    callUsDetailed:
      "Наша команда доступна для звонков все дни недели с 12:00 до 22:00.",
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
  return <h3 className="subheader_text text-light_gray">{children}</h3>;
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
        "070-123-45-67",
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
        console.log("Submitting values: ", values); // Debug: Log form data

        const response = await fetch("http://45.85.146.73:4000/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          alert("Form submitted!");
          formik.resetForm();
        } else {
          const responseText = await response.text(); // Get response text for debugging
          alert("Form submission failed!");
          console.log("Response: ", responseText);
          console.log("Values: ", values);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  return (
    <div className="mx-auto h-full w-11/12" id="contact">
      <SectionHeaderTitle>{contactElement[lang].title}</SectionHeaderTitle>
      <div
        className={`flex w-full flex-col justify-between items-start md:flex-row ${montserratFont600.className}`}
      >
        <div className="w-full  md:w-6/12">
          <div className="gap- flex w-full flex-col items-start mt-10">
            <SubheaderTitle>{contactElement[lang].callUs}</SubheaderTitle>
            <p className="text-[#e7e7e6]/50"></p>
            <p className="my-5 flex items-center gap-1.5">
              <IoCallOutline />
              <span>051 897 01 15</span>
            </p>
            <p className="text-[#e7e7e6]/50 w-full   md:w-3/4 mb-4">
              {contactElement[lang].callUsDetailed}
            </p>
            <SubheaderTitle>{contactElement[lang].chatWithUs}</SubheaderTitle>
            {/* <p className="mb-5 text-[#e7e7e6]/50">
              Speak to ur friendly team via live chat
            </p> */}
          </div>
          <div className="flex flex-col gap-3 pt-0 text-[#E7E7E6] md:pt-2 ">
            <a
              href={`mailto:neodesignstudio2019@gmail.com?subject=Interior Design&body=Hello.%20I%20want%20to%20design%20my%20house%20.`}
              className="uppercase underline underline-offset-4 md:hover:text-[#855E36] transition-all duration-300 md:hover:cursor-pointer"
            >
              {contactElement[lang].sendMessageViaEmail}
            </a>
            <a
              href="https://www.instagram.com/neodesign_studio/"
              target="_blank"
              className="uppercase underline underline-offset-4 md:hover:text-[#855E36] transition-all duration-300 md:hover:cursor-pointer"
            >
              {contactElement[lang].sendMessageViaInstagram}
            </a>
            <a
              target="_blank"
              href="https://wa.link/r4z1i6"
              className="uppercase underline underline-offset-4 md:hover:text-[#855E36] transition-all duration-300 md:hover:cursor-pointer"
            >
              {contactElement[lang].sendMessageViaWhatsapp}
            </a>
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
                className="rounded-xl border border-[#e7e7e6]/50 bg-[#1e1e1e] p-3 text-[#e7e7e6] focus:outline-none"
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
                className="rounded-xl border border-[#e7e7e6]/50 bg-[#1e1e1e] p-3 text-[#e7e7e6] focus:outline-none"
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
              className="w-full rounded-xl border border-[#e7e7e6]/50 bg-[#1e1e1e] p-3 text-[#e7e7e6] focus:outline-none"
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
              className="w-full rounded-xl border border-[#e7e7e6]/50 bg-[#1e1e1e] p-3 text-[#e7e7e6] focus:outline-none"
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
              className="w-full rounded-xl border border-[#e7e7e6]/50 bg-[#1e1e1e] p-3 text-[#e7e7e6] focus:outline-none"
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
      <div className="block md:hidden bg-black w-full h-[100px]"></div>
    </div>
  );
};

export default Contact;
