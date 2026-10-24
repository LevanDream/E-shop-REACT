import { useEffect } from "react";
import {
  Alert,
  Button,
  Flex,
  Loader,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { PRODUCTS_LIMIT, useGetProducts } from "../queries";
import { useFiltersStore } from "../store";
import { ProductCard } from "./product-card";
import { ProductsFilters } from "./products-filters";

const COLS = { base: 1, xs: 2, md: 3, lg: 4 };

export const ProductsContent = () => {
  const search = useFiltersStore((s) => s.search);
  const category = useFiltersStore((s) => s.category);
  const sort = useFiltersStore((s) => s.sort);
  const reset = useFiltersStore((s) => s.reset);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetProducts({ search, category, sort });

  const { ref: sentinelRef, entry } = useIntersection({
    root: null,
    threshold: 0,
    rootMargin: "400px",
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    // data в зависимостях: если после загрузки страницы sentinel всё ещё виден — грузим дальше
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage, data]);

  const products = data?.pages.flatMap((page) => page.products) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <Stack>
      <Title order={3}>Каталог</Title>

      <ProductsFilters />

      {isLoading && (
        <SimpleGrid cols={COLS}>
          {Array.from({ length: PRODUCTS_LIMIT }, (_, i) => (
            <Skeleton key={i} height={380} />
          ))}
        </SimpleGrid>
      )}

      {isError && (
        <Alert color="red" title="Ошибка загрузки">
          <Stack gap="xs" align="flex-start">
            <Text size="sm">
              {error instanceof Error
                ? error.message
                : "Не удалось загрузить товары"}
            </Text>
            <Button size="xs" onClick={() => refetch()}>
              Повторить
            </Button>
          </Stack>
        </Alert>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <Flex direction="column" align="center" gap="xs" py="xl">
          <Text c="dimmed">Ничего не найдено</Text>
          <Button variant="light" onClick={reset}>
            Сбросить фильтры
          </Button>
        </Flex>
      )}

      {products.length > 0 && (
        <>
          <Text size="sm" c="dimmed">
            Показано {products.length} из {total}
          </Text>

          <SimpleGrid cols={COLS}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SimpleGrid>

          <div ref={sentinelRef} style={{ height: 1 }} />

          <Flex justify="center" py="md">
            {isFetchingNextPage ? (
              <Loader size="sm" />
            ) : hasNextPage ? (
              <Button variant="subtle" onClick={() => fetchNextPage()}>
                Ещё
              </Button>
            ) : (
              <Text size="sm" c="dimmed">
                Это все товары
              </Text>
            )}
          </Flex>
        </>
      )}
    </Stack>
  );
};
