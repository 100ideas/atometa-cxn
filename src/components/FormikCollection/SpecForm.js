import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "stores";
import { Formik, Form, useField, Field, FieldArray } from "formik";
import * as Yup from 'yup';
import { Debug, FormikDebug } from './FormikDebug'
// import { FormHeader } from './FormHeader'

export const MyDynamicForm = observer( ({
  move, swap, push, insert, unshift, pop, form, values, ...rest
}) => {
  console.log("MyDynamicForm props", rest)
  return (
  <div>
    {/* {values.friends.map((friend, index) => (
      <div key={index}>
        <Field name={`friends[${index}].name`} />
        <Field name={`friends.${index}.age`} /> // both these conventions do
        the same
        <button type="button" onClick={() => arrayHelpers.remove(index)}>
          -
        </button>
      </div>
    ))} */}
    <button
      type="button"
      onClick={() => push({ name: '', age: '' })}
    >
      +
    </button>
  </div>
  )}
)

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

export const SpecForm = observer( () => {
  const { collectionsStore } = useStore();

  let formikCxn = collectionsStore.getCollection('formikTest')
  let {form: mobxForm} = collectionsStore.getCollection('formikTest')

  // console.log(formikCxn.asJS().spec.initialValues)
  // console.log("collectionsStore.getCollection('formikTest')", collectionsStore.getCollection('formikTest'))
  console.log("collectionsStore 'formikTest'", formikCxn)
  console.log("initialVals", {initialValues: {...formikCxn.form.initialValues}})
  

  return (
    <Formik
      initialValues={{
        ...{ 
          firstName: '', 
          lastName: '', 
          email: '', 
          acceptedTerms: false,
        },
        ...formikCxn.form.initialValues,
        ...formikCxn.form.values
      }}
      // validationSchema={Yup.object({
      //   firstName: Yup.string()
      //     .min(15, 'Must be 15 characters or less')
      //     .required('Required'),
      //   lastName: Yup.string()
      //     .min(20, 'Must be 20 characters or less')
      //     .required('Required'),
      //   email: Yup.string()
      //     .email('Invalid email addresss`')
      //     .required('Required'),
      // })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          // mobxForm.values = values
          formikCxn.form.values = values
          // mobxForm.updateForm(values)
          // formikCxn.updateForm(values)
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

          <FieldArray
            name="friends"
            render={arrayHelpers => (
              <div>
                {values.friends && values.friends.length > 0 ? (
                  values.friends.map((friend, index) => (
                    <div key={index}>
                      <Field name={`friends.${index}`} />
                      <button
                        type="button"
                        onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
                      >
                        +
                      </button>
                    </div>
                  ))
                ) : (
                  <button type="button" onClick={() => arrayHelpers.push('')}>
                    {/* show this when user has removed all friends from the list */}
                    Add a friend
                  </button>
                )}
                <div>
                  <button type="submit">Submit</button>
                </div>
              </div>
            )}
          />

          {/* <FieldArray
            name="friends"
            component={MyDynamicForm}
          /> */}

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
          <Debug mobxForm={mobxForm} displayName="mobxForm generic debug"/>
          <FormikDebug displayName="<SpecForm>"/>
        </Form>
        );
      }}
    </Formik>
  );
})