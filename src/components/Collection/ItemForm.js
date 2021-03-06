import React from "react";
import { Formik, Form, useField, Field, FieldArray } from "formik";
import * as Yup from 'yup';
import { FormikDebug } from './FormDebug'
// import { FormHeader } from './FormHeader'

const MyTextInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export const SpecForm = () => {
  return (
    <Formik
      initialValues={{ firstName: '', lastName: '', email: '', acceptedTerms: false }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    > 
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;
        return (
        <Form className="cxn-form" style={{border: '1px solid gray'}}>
          <div className="flexbar bm2">
            <h4><code>{"<Specform>"}</code></h4>
          </div>

          <MyTextInput
            label="First Name"
            name="firstName"
            type="text"
            placeholder="Jane"
          />

          <MyTextInput
            label="Last Name"
            name="lastName"
            type="text"
            placeholder="Smith"
          />

          <MyTextInput
            label="email"
            name="email"
            type="email"
            placeholder=""
          />
          
          <button type="submit" style={{display: "block"}}>Submit</button>

          <FormikDebug displayName="<SpecForm>"/>
        </Form>
        );
      }}
    </Formik>
  );
};