import {
  ActionIcon,
  AppShell,
  Container,
  Flex,
  Indicator,
  Text,
} from "@mantine/core";
import { ShoppingCart } from "iconsax-reactjs";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import { selectCartCount, useCartStore } from "../components/cart/store";

const App = () => {
  const navigate = useNavigate();
  const count = useCartStore(selectCartCount);

  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Flex align="center" justify="space-between" h="100%">
            <Link
              to={ROUTES.HOME}
              style={{ textDecoration: "none", color: "#1f1f1f" }}
            >
              <Text fw={700} size="lg">
                E-Shop
              </Text>
            </Link>

            <Indicator
              label={count}
              size={18}
              color="red"
              disabled={count === 0}
              offset={4}
            >
              <ActionIcon
                variant="default"
                size="lg"
                aria-label="Корзина"
                onClick={() => navigate(ROUTES.CART)}
              >
                <ShoppingCart size={20} />
              </ActionIcon>
            </Indicator>
          </Flex>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
