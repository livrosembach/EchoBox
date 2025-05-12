import React from "react";
import { CategoryData } from "../interface/feedback/CategoryData";
import '../css/SendFeedbacks.css';

export default function CategorySelect({ categories }: { categories: CategoryData[] }) {
    return (
        <select name="category" id="category">
            <option value="0"></option>
            {categories.map((cd) => (
                <option key={cd.idcategory} value={cd.idcategory}>
                    {cd.typecategory}
                </option>
            ))}
        </select>
    );
}
