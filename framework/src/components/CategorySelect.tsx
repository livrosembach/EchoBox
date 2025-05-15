import React from "react";
import { CategoryData } from "../interface/feedback/CategoryData";
import '../css/SendFeedbacks.css';

export default function CategorySelect({ categories }: { categories: CategoryData[] }) {
    return (
        <select name="category" id="category">
            <option value="0"></option>
            {categories.map((cd) => (
                <option key={cd.idCategory} value={cd.idCategory}>
                    {cd.typeCategory}
                </option>
            ))}
        </select>
    );
}