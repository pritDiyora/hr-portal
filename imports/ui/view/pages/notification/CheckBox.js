import React from 'react'

export const CheckBox = props => {
    return (
        < div className="checkbox-inline form-check abc-checkbox abc-checkbox-success form-check-inline" style={{ marginLeft: "10px", verticalAlign: 'center' }}>
            <input className="form-check-input"
                key={props.id} onClick={props.handleCheckChieldElement} type="checkbox" checked={props.isChecked} value={props.value}
            />
            <label className="form-check-label"  style={{ paddingLeft: "15px" }}></label>
        </div >
    )
}

export default CheckBox

