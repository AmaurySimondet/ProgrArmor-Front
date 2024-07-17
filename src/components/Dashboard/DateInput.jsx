import {React, useState} from "react";

function DateInput(props) {

  const [date, setDate] = useState(props.date);

  function handleChange(event){
    event.preventDefault();

    setDate(event.target.value);
    props.changeDate(event.target.value);
    
  }

  return (
    <div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Date</label>
            <div className="col-sm-10">
              <input type="date"
                  className="form-control"
                  value={date}
                  onChange={handleChange}
                  id="date"
              />
            </div>
          </div>
   </div>
  );
};

export default DateInput;