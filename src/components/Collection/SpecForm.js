import React from "react";
import { observable, observer } from "mobx-react-lite";
import { useStore } from "stores";
import * as Yup from 'yup';
import { Debug } from './FormDebug'

let specs = observable({
  v1: ['isbn', 'book', 'sale']
})

export const MyDynamicForm = observer( ({
  values, ...rest
}) => {
  console.log("MyDynamicForm props", rest)
  return (
  <div>
    <button
      type="button"
      onClick={() => console.log({ name: '', age: '' })}
    >+</button>
  </div>
  )}
)

const MyTextInput = ({ label, ...props }) => {
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
  console.log("collectionsStore 'formikTest'", formikCxn)

  return (
    <p>form goes here</p>
    // <FormComp...
    //   ...props...
    // >
      // {props => {
      //   const {
      //     values,
      //     touched,
        // } = props;
        // return (
        // <Form className="cxn-form" style={{border: '1px solid gray'}}>
        // </Form>
        // );
      // }}
    // </Formik>
  );
})