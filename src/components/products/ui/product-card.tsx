import { memo } from "react";
import { Badge, Button, Card, Flex, Image, Rating, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ShoppingCart } from "iconsax-reactjs";
import { useCartStore } from "../../cart/store";
import { formatPrice } from "../../../utils/format-price";
import type { ProductType } from "../types";

type Props = {
  product: ProductType;
};

const ProductCardBase = ({ product }: Props) => {
  const add = useCartStore((s) => s.add);
  const quantity = useCartStore(
    (s) => s.items.find((i) => i.product.id === product.id)?.quantity ?? 0,
  );

  const handleAdd = () => {
    add(product);
    notifications.show({
      title: "Успешно!",
      message: `«${product.title}» добавлен в корзину.`,
      color: "green",
      autoClose: 1500,
    });
  };

  return (
    <Card
      withBorder
      padding="md"
      h="100%"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Card.Section>
        <Image
          src={product.thumbnail}
          alt={product.title}
          h={180}
          fit="contain"
          loading="lazy"
        />
      </Card.Section>

      <Flex justify="space-between" align="flex-start" gap="xs" mt="md">
        <Text fw={600} lineClamp={2}>
          {product.title}
        </Text>
        <Badge variant="light" style={{ flexShrink: 0 }}>
          {product.category}
        </Badge>
      </Flex>

      <Text size="sm" c="dimmed" lineClamp={2} mt="xs" style={{ flexGrow: 1 }}>
        {product.description}
      </Text>

      <Rating value={product.rating} fractions={2} readOnly size="sm" mt="sm" />

      <Flex justify="space-between" align="center" mt="md">
        <Text fw={700} size="lg">
          {formatPrice(product.price)}
        </Text>
        <Button
          size="xs"
          leftSection={<ShoppingCart size={16} />}
          variant={quantity > 0 ? "light" : "filled"}
          onClick={handleAdd}
        >
          {quantity > 0 ? `В корзине: ${quantity}` : "В корзину"}
        </Button>
      </Flex>
    </Card>
  );
};

export const ProductCard = memo(ProductCardBase);
