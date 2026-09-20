import React, {
  createContext, useContext, useMemo, useReducer,
} from 'react';

const FormStateContext = createContext(null);
const FormDispatchContext = createContext(null);

const initialState = {
  loanType: '',
  loanAmount: 500000,
  loanTenure: 24,
  loanPurpose: '',
  referralCode: '',
  fullName: '',
  dob: '',
  gender: '',
  maritalStatus: '',
  fatherName: '',
  motherName: '',
  email: '',
  mobile: '',
  alternateMobile: '',
  pan: '',
  panVerified: false,
  aadhaar: '',
  aadhaarConsent: false,
  voterId: '',
  passport: '',
  addressLine1: '',
  addressLine2: '',
  pincode: '',
  city: '',
  state: '',
  residenceType: '',
  rentAmount: 0,
  yearsAtAddress: 0,
  sameAsPermanent: true,
  permanentAddressLine1: '',
  permanentPincode: '',
  permanentCity: '',
  permanentState: '',
  employmentType: '',
  employerName: '',
  designation: '',
  monthlyIncome: 0,
  yearsExperience: 0,
  businessName: '',
  businessType: '',
  annualTurnover: 0,
  yearsInBusiness: 0,
  gstNumber: '',
  officeAddress: '',
  coApplicantRequired: false,
  coApplicantName: '',
  relationship: '',
  coApplicantPan: '',
  coApplicantIncome: 0,
  coApplicantConsent: false,
  documents: {},
  signature: null,
  currentStep: 1,
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELDS': return { ...state, ...action.payload };
    case 'SET_STEP': return { ...state, currentStep: action.payload };
    case 'SET_DOCUMENT':
      return { ...state, documents: { ...state.documents, [action.key]: action.value } };
    case 'RESTORE': return { ...initialState, ...action.payload };
    case 'RESET': return initialState;
    default: return state;
  }
}

export function FormStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const memoState = useMemo(() => state, [state]);
  return (
    <FormStateContext.Provider value={memoState}>
      <FormDispatchContext.Provider value={dispatch}>{children}</FormDispatchContext.Provider>
    </FormStateContext.Provider>
  );
}

export function useFormState() {
  const ctx = useContext(FormStateContext);
  if (!ctx) throw new Error('useFormState must be used within FormStoreProvider');
  return ctx;
}

export function useFormDispatch() {
  const ctx = useContext(FormDispatchContext);
  if (!ctx) throw new Error('useFormDispatch must be used within FormStoreProvider');
  return ctx;
}
