import { useEffect, useState } from "react";
import { Flex, Select, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { SearchNormal1 } from "iconsax-reactjs";
import { useGetCategories } from "../queries";
import { useFiltersStore } from "../store";
import type { SortType } from "../types";

const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: "default", label: "По умолчанию" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "rating", label: "По рейтингу" },
];

export const ProductsFilters = () => {
  const search = useFiltersStore((s) => s.search);
  const category = useFiltersStore((s) => s.category);
  const sort = useFiltersStore((s) => s.sort);
  const setSearch = useFiltersStore((s) => s.setSearch);
  const setCategory = useFiltersStore((s) => s.setCategory);
  const setSort = useFiltersStore((s) => s.setSort);

  const { data: categories = [], isLoading } = useGetCategories();

  // Локальное значение + debounce, чтобы не слать запрос на каждую букву
  const [text, setText] = useState(search);
  const [debouncedText] = useDebouncedValue(text, 300);

  useEffect(() => {
    setSearch(debouncedText.trim());
  }, [debouncedText, setSearch]);

  // Если фильтры сбросили снаружи (кнопка «Сбросить») — очищаем поле
  useEffect(() => {
    if (search === "") setText("");
  }, [search]);

  return (
    <Flex gap="sm" wrap="wrap" align="flex-end">
      <TextInput
        label="Поиск"
        placeholder="Название товара"
        leftSection={<SearchNormal1 size={16} />}
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        style={{ flex: 2, minWidth: 220 }}
      />

      <Select
        label="Категория"
        placeholder="Все категории"
        description={search ? "Недоступно при поиске" : undefined}
        data={categories.map((c) => ({ value: c.slug, label: c.name }))}
        value={category}
        onChange={setCategory}
        disabled={isLoading || !!search}
        searchable
        clearable
        style={{ flex: 1, minWidth: 180 }}
      />

      <Select
        label="Сортировка"
        data={SORT_OPTIONS}
        value={sort}
        onChange={(v) => setSort((v as SortType | null) ?? "default")}
        allowDeselect={false}
        style={{ flex: 1, minWidth: 180 }}
      />
    </Flex>
  );
};
