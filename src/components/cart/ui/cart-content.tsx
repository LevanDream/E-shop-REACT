import {
  ActionIcon,
  Button,
  Flex,
  Image,
  NumberInput,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Trash } from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routes";
import { formatPrice } from "../../../utils/format-price";
import { selectCartTotal, useCartStore } from "../store";

export const CartContent = () => {
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectCartTotal);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const handleClear = () => {
    modals.openConfirmModal({
      title: "Очистка корзины",
      centered: true,
      children: (
        <Text size="sm">Вы уверены, что хотите удалить все товары из корзины?</Text>
      ),
      labels: { confirm: "Очистить", cancel: "Отмена" },
      confirmProps: { color: "red" },
      onConfirm: clear,
    });
  };

  const handleCheckout = () => {
    notifications.show({
      title: "Успешно!",
      message: `Заказ на сумму ${formatPrice(total)} оформлен (демо).`,
      color: "green",
    });
    clear();
    navigate(ROUTES.HOME);
  };

  if (items.length === 0) {
    return (
      <Stack align="center" py="xl">
        <Title order={3}>Корзина пуста</Title>
        <Button onClick={() => navigate(ROUTES.HOME)}>К каталогу</Button>
      </Stack>
    );
  }

  return (
    <Stack>
      <Flex align="center" justify="space-between">
        <Title order={3}>Корзина</Title>
        <Button variant="subtle" color="red" onClick={handleClear}>
          Очистить
        </Button>
      </Flex>

      <Table.ScrollContainer minWidth={600}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Товар</Table.Th>
              <Table.Th>Цена</Table.Th>
              <Table.Th>Количество</Table.Th>
              <Table.Th>Сумма</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {items.map(({ product, quantity }) => (
              <Table.Tr key={product.id}>
                <Table.Td>
                  <Flex align="center" gap="sm">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      w={56}
                      h={56}
                      fit="contain"
                    />
                    <Text fw={500}>{product.title}</Text>
                  </Flex>
                </Table.Td>
                <Table.Td>{formatPrice(product.price)}</Table.Td>
                <Table.Td>
                  <NumberInput
                    w={90}
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(v) => setQuantity(product.id, Number(v) || 1)}
                  />
                </Table.Td>
                <Table.Td>{formatPrice(product.price * quantity)}</Table.Td>
                <Table.Td>
                  <Flex justify="end">
                    <ActionIcon color="red" onClick={() => remove(product.id)}>
                      <Trash size={20} />
                    </ActionIcon>
                  </Flex>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Flex align="center" justify="flex-end" gap="lg">
        <Text size="xl" fw={700}>
          Итого: {formatPrice(total)}
        </Text>
        <Button onClick={handleCheckout}>Оформить заказ</Button>
      </Flex>
    </Stack>
  );
};
