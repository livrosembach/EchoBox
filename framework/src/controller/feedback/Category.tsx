import { CategoryData } from "../../interface/feedback/CategoryData";

export const getCategory = async (): Promise<CategoryData[]> => {
    try {
        const response = await fetch("http://localhost:3003/category", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch categories:", await response.text());
            return [];
        }

        const data: CategoryData[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const createCategory = async (categoryData: Omit<CategoryData, 'idcategory'>): Promise<CategoryData | null> => {
    try {
        const response = await fetch("http://localhost:3003/category", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                typeCategory: categoryData.typecategory,
                colorCategory: categoryData.colorcategory
            }),
        });

        if (!response.ok) {
            console.error("Failed to create category:", await response.text());
            return null;
        }

        const data = await response.json();
        return {
            idcategory: data.idCategory || data.idcategory,
            typecategory: data.typeCategory || data.typecategory,
            colorcategory: data.colorCategory || data.colorcategory
        };
    } catch (error) {
        console.error("Error creating category:", error);
        return null;
    }
};

export const updateCategory = async (id: number, categoryData: Omit<CategoryData, 'idcategory'>): Promise<CategoryData | null> => {
    try {
        const response = await fetch(`http://localhost:3003/category/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                typeCategory: categoryData.typecategory,
                colorCategory: categoryData.colorcategory
            }),
        });

        if (!response.ok) {
            console.error("Failed to update category:", await response.text());
            return null;
        }

        const data = await response.json();
        return {
            idcategory: data.idCategory || data.idcategory || id,
            typecategory: data.typeCategory || data.typecategory,
            colorcategory: data.colorCategory || data.colorcategory
        };
    } catch (error) {
        console.error("Error updating category:", error);
        return null;
    }
};

export const deleteCategory = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`http://localhost:3003/category/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to delete category:", await response.text());
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error deleting category:", error);
        return false;
    }
};

