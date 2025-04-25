"use client";

import React from "react";
import SectionHeaderTitle from "./SectionHeaderTitle";
import { Montserrat } from "next/font/google";
import { IoCallOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { selectLanguage } from "@/store/services/languageSlice";

import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

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

// Animated form field component
interface AnimatedFormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  placeholder: string;
  error?: string | undefined;
  touched?: boolean | undefined;
  delay: number;
  className?: string;
}

const AnimatedFormField: React.FC<AnimatedFormFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  delay,
  className = "w-full",
}) => {
  return (
    <motion.div
      className={`flex flex-col gap-2 ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#e7e7e6]/50 bg-[#1e1e1e] p-3 text-[#e7e7e6] focus:outline-none"
      />
      {touched && error && <div className="text-red-500 text-sm">{error}</div>}
    </motion.div>
  );
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
        const response = await fetch("/api/contact", {
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
          console.log("Form submission failed:", response.status);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  return (
    <div className="mx-auto h-full w-11/12" id="contact">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <SectionHeaderTitle>{contactElement[lang].title}</SectionHeaderTitle>
      </motion.div>
      <div
        className={`flex w-full flex-col justify-between items-start md:flex-row ${montserratFont600.className}`}
      >
        <div className="w-full md:w-6/12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="gap- flex w-full flex-col items-start mt-10"
          >
            <SubheaderTitle>{contactElement[lang].callUs}</SubheaderTitle>
            <p className="text-[#e7e7e6]/50"></p>
            <p className="my-5 flex items-center gap-1.5">
              <IoCallOutline />
              <span>051 897 01 15</span>
            </p>
            <p className="text-[#e7e7e6]/50 w-full md:w-3/4 mb-4">
              {contactElement[lang].callUsDetailed}
            </p>
            <SubheaderTitle>{contactElement[lang].chatWithUs}</SubheaderTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-3 pt-0 text-[#E7E7E6] md:pt-2 "
          >
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
          </motion.div>
        </div>
        <hr className="mx-auto mt-5 block" />
        <form className="mt-8 w-full md:w-1/2" onSubmit={formik.handleSubmit}>
          <motion.div
            className="flex justify-between gap-2 md:gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <AnimatedFormField
              label={contactElement[lang].firstName}
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={contactElement[lang].firstName}
              error={formik.errors.firstName}
              touched={formik.touched.firstName}
              delay={0}
              className="w-1/2"
            />

            <AnimatedFormField
              label={contactElement[lang].surname}
              name="surname"
              value={formik.values.surname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={contactElement[lang].surname}
              error={formik.errors.surname}
              touched={formik.touched.surname}
              delay={0.1}
              className="w-1/2"
            />
          </motion.div>

          <AnimatedFormField
            label={contactElement[lang].email}
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={contactElement[lang].email}
            error={formik.errors.email}
            touched={formik.touched.email}
            delay={0.2}
            className="mt-5"
          />

          <AnimatedFormField
            label={contactElement[lang].phoneNumber}
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={contactElement[lang].phoneNumber}
            error={formik.errors.phoneNumber}
            touched={formik.touched.phoneNumber}
            delay={0.3}
            className="mt-5"
          />

          <AnimatedFormField
            label={contactElement[lang].message}
            name="message"
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={contactElement[lang].messageInner}
            error={formik.errors.message}
            touched={formik.touched.message}
            delay={0.4}
            className="mt-5"
          />

          <motion.button
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mt-10 w-40 ml-auto bg-[#e7e7e6] text-[#646060] md:hover:bg-[#646060] md:hover:text-[#e7e7e6] flex justify-center p-3 rounded-xl transition-all duration-300 ease-out"
            type="submit"
          >
            {contactElement[lang].submit}
          </motion.button>
        </form>
      </div>
      <div className="block md:hidden bg-black w-full h-[100px]"></div>
    </div>
  );
};

export default Contact;
