const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    color: "black",
    textAlign: "justify",
    fontSize: "12px",
    fontWeight: state.data.className === "select-title" ? 800 : 500
  })
}

const customStylesMini = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    color: "black",
    textAlign: "justify",
    fontSize: "12px",
    fontWeight: state.data.className === "select-title" ? 800 : 500
  }),

  control: (provided, state) => ({
    ...provided,

    minHeight: '20px',
    height: '20px',
    boxShadow: state.isFocused ? null : null,
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: '20px',
    padding: '0 6px'
  }),

  input: (provided, state) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorSeparator: state => ({
    display: 'none',
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '20px',
    marginTop: "-1px",
  }),
};

const customStylesDark = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "black",
    color: "white",
    textAlign: "justify",
    fontSize: "12px",
    fontWeight: state.data.className === "select-title" ? 800 : 500,
  }),
  control: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: "black",
    color: "white",
    minHeight: '38px',
    height: '38px',
    boxShadow: state.isFocused ? null : null,
  }),
  placeholder: (defaultStyles) => ({
    ...defaultStyles,
    color: 'white',
  }),
  singleValue: (defaultStyles) => ({
    ...defaultStyles,
    color: 'white',
  }),
  input: (defaultStyles) => ({
    ...defaultStyles,
    color: 'white',
    margin: "0px"
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: '38px',
    padding: '0 6px'
  }),

  indicatorSeparator: state => ({
    display: 'none',
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '38px',
  }),
}

const customStylesDarkMini = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "black",
    color: "white",
    textAlign: "justify",
    fontSize: "12px",
    fontWeight: state.data.className === "select-title" ? 800 : 500,
  }),

  control: (provided, state) => ({
    ...provided,
    backgroundColor: "black",
    color: "white",
    minHeight: '20px',
    height: '20px',
    boxShadow: state.isFocused ? null : null,
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: '20px',
    padding: '0 6px'
  }),

  placeholder: (defaultStyles) => ({
    ...defaultStyles,
    color: 'white',
  }),
  singleValue: (defaultStyles) => ({
    ...defaultStyles,
    color: 'white',
  }),


  input: (provided, state) => ({
    ...provided,
    margin: '0px',
    color: 'white',
  }),

  indicatorSeparator: state => ({
    display: 'none',
  }),

  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '20px',
    marginTop: "-1px"
  }),
};

export { customStylesMini };
export { customStyles };
export { customStylesDarkMini };
export { customStylesDark };