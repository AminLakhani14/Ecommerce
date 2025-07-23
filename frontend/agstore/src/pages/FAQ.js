import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import generalIcon from '../assets/images/general.svg'
import shippingIcon from '../assets/images/shipping.svg'
import payment from '../assets/images/payment.svg'

const faqData = [
  {
    key: "general",
    label: "General",
    icon: generalIcon,
    questions: [
      "What sizes do you offer, and how do I find my perfect fit?",
      "What materials are your clothes made from?",
      "Are your clothes true to size?",
      "Will an item be restocked if it’s sold out?",
      "Do I need an account to place an order?",
    ],
  },
  {
    key: "shipping",
    label: "Shipping & Returns",
    icon: shippingIcon,
    questions: [
      "What are your shipping options and delivery times?",
      "Do you offer international shipping?",
      "How do I track my order?",
      "What is your return and exchange policy?",
      "Can I cancel or change my order after it’s placed?",
    ],
  },
  {
    key: "payments",
    label: "Payments & Orders",
    icon: payment,
    questions: [
      "What payment methods do you accept?",
      "Is my payment information secure?",
      "Why was my payment declined?",
      "Do you offer promo codes or discounts?",
      "How can I contact customer support about my order?",
    ],
  },
];

export default function FAQPage() {
  const [selected, setSelected] = useState("general");
  const [openItems, setOpenItems] = useState({});

  const handleAccordionToggle = (sectionKey, eventKey) => {
    setSelected(sectionKey);
    setOpenItems((prev) => {
      const newState = {};
      newState[eventKey] = !prev[eventKey];
      return newState;
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="text-center py-5 mt-5 ">
        <h2 className="fw-bold mt-5 pt-5 recentLaunchHeading">FAQ</h2>
        <p className="text-muted ">Your Questions Answered Here</p>
      </div>

      <div className="row justify-content-center w-100">
        <div className="col-lg-2 p-4 mt-5 pt-3">
          {faqData.map((item) => (
            <div
              key={item.key}
              className={`mb-4 d-flex justify-content-start align-items-center fw-semibold ${
                selected === item.key ? "text-dark" : "text-muted"
              }`}
              onClick={() => {
                const element = document.getElementById(item.key);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
                  setSelected(item.key);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <span className="ms-3">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="col-lg-8 p-5">
          {faqData.map((section) => (
            <div key={section.key} className="mb-5" id={section.key}>
              <h5 className="mb-4 faqAccordionSubHeading d-flex ">
                <img className="me-2" src={section.icon}/>
                {section.label}
              </h5>
              <Accordion activeKey={Object.keys(openItems).find((key) => openItems[key])}>
                {section.questions.map((q, idx) => {
                  const eventKey = section.key + idx;
                  const isOpen = openItems[eventKey];

                  return (
                    <Accordion.Item eventKey={eventKey} key={idx}>
                      <Accordion.Header
                        className="border-bottom"
                        onClick={() => handleAccordionToggle(section.key, eventKey)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex justify-content-between align-items-center w-100 faqAccordionInnerSection">
                          <span>{q}</span>
                          <span
                            className="rounded-circle border border-dark d-flex justify-content-center align-items-center"
                            style={{ width: 24, height: 24 }}
                          >
                            {isOpen ? <FaMinus size={12} /> : <FaPlus size={12} />}
                          </span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="faqAccordionInnerSection">
                        Answer content for: <strong>{q}</strong> goes here.
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
      <style type="text/css">
        {`
          .accordion-button::after {
            display: none;
          }
          .accordion-button:focus {
            border-color: transparent;
            box-shadow: none;
          }
          .accordion-button:not(.collapsed) {
            color: #000; /* Optional: Keep the text dark when open */
            background-color: #f8f9fa; /* Optional: Keep a light background when open */
            box-shadow: none;
          }
        `}
      </style>
    </div>
  );
}