import React, { useEffect } from "react";
// import { useStore } from "stores";
import useForm from "react-hook-form";
import {
  observable,
  computed,
  action,
  autorun,
  has,
  get,
  set,
  remove,
  entries,
  toJS,
  toJSON
} from "mobx";
import { observer, Observer } from "mobx-react-lite";
import * as yup from 'yup'
import { Debug } from '@/components/Collection/FormDebug'
import "react-hook-form.css";

let cxn = observable({

})

const mockDefs = [
  {
    id: 'id/001',
    displayName: 'isbn',
    datatype: 'string',
    description: 'isbn_10 number',
    example: "000-1111-111Z1",
    rules: []
  },
  {
    id: 'id/002',
    displayName: '',
    datatype: '',
    description: '',
    example: '',
    rules: []
  },
  {
    id: 'id/003',
    displayName: '',
    datatype: '',
    description: '',
    example: '',
    rules: []
  }
]

let formCxn = observable({
  newfields: [],
  lastname: 'default',
  age: 0,
  submitted: 0,
  temp: {},
  newform: {}
})

const SignupSchema = yup.object().shape({
  lastname: yup.string().required().matches(/[a-zA-Z-'`]+[ a-zA-Z-'`]/),
  // age: yup.number().required(),
  age: yup.number().required(),
})

function Form() {
  const { register, handleSubmit, formState, watch, errors } = useForm({
    mode: "onBlur",
    validationSchema: SignupSchema
  });

  const onSubmit = data => {
    console.log("\n+++++++ submitted +++++++", data)
    // formCxn.submitted = data
    data.newfields = data.newfields.split(' ')
    Object.keys(data).map( k => formCxn[k] = data[k] )
    // delete formCxn.temp  // every render tries to set subfields to temp so keep it around
    formCxn.submitted++
  }

  let currVals = watch()
  Object.keys(currVals).map( k => {
    if(formState.touched.includes(k)){
      if(! (k in errors)) formCxn.temp[k] = currVals[k]
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Field names (required)</label>
        <input
          type="text"
          name="newfields"
          ref={register}
          placeholder={formCxn.newfields}
        />
      </div>
      <div>
        <label>Last name (string)</label>
        <input type="text" name="lastname" placeholder={formCxn.lastname} ref={register} />
        {errors.lastname && <p>{errors.lastname.message}</p>}
      </div>
      {/* <div>
        <label>Email</label>
        <input type="text" name="Email" ref={register} />
      </div> */}
      <div>
        <label>age (num)</label>
        <input type="text" name="age" placeholder={formCxn.age} ref={register} />
        {errors.age && <p>{errors.age.message}</p>}
      </div>
      {/* <div>
        <label>Title</label>
        <select name="Title" ref={register}>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Miss">Miss</option>
          <option value="Dr">Dr</option>
        </select>
      </div>

      <div>
        <label>Are you a developer?</label>
        <input name="developer" type="radio" value="Yes" ref={register} />
        <input name="developer" type="radio" value="No" ref={register} />
      </div> */}

      <pre>{JSON.stringify(formState, null, 2)}</pre>

      <input type="submit" />
    </form>
  );
}

const DynamicForm = observer( ({defs}) => {
  const { register, handleSubmit, formState, watch, errors } = useForm();
  const fields = defs.newfields
    console.log("\n\n DynamicForm got ", toJS(fields))
  const onSubmit = data => formCxn.newform = data
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    {fields.map( (name, idx) => {
      return (
        <>
          <label htmlFor="idx">{name}</label>
          <input
            // name={`${idx}-${name}`}
            name={`${name}`}
            placeholder={`${idx}-${name}`}
            ref={register}
          />
        </>
      )
    })}
    {fields.length > 0 && <input type="submit" />}
    </form>
  )
})

export default function MockForm(props){
  return <>
    <Debug {...{formCxn}} displayName="react-hook-form formCxn state"/>
    <Form />
    {/* <DynamicForm defs={['first']}/> */}
    <DynamicForm defs={formCxn}/>
  </>
  
}