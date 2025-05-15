import React from "react";
import { CompanyData } from "../interface/register/CompanyData";
import '../css/SendFeedbacks.css';

export default function CompanySelect({ companies }: { companies: CompanyData[] }) {
    return (
        <select name="company" id="company">
            <option value="0"></option>
            {companies.map((cd) => (
                <option key={cd.idCompany} value={cd.idCompany}>
                    {cd.nameCompany}
                </option>
            ))}
        </select>
    );
}