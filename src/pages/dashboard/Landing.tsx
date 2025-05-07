import { FC, useState } from 'react';
import { Button, Table, Title, useMantineTheme } from "@mantine/core";
import { useAppStore, useLaunchStore } from '../../store/app.store';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png';
import "../dashboard/table.scss";
import logoutIcon from "../../images/logout.svg"
import ShipTable from './Table';
import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const Landing: FC = () => {
	const theme = useMantineTheme();
	const logout = useAppStore((state) => state.logout);
	const navigate = useNavigate()
	const [opened, { open, close }] = useDisclosure(false);
	const [selectedShip, setSelectedShip] = useState<any>(null);
	
	return (
		<div style={{ marginTop: theme.spacing.md }}>
			<div className="nav-header" style={{ padding: theme.spacing.sm }}>
				<img src={logo} className="logo-img" />
				<Button
					onClick={() => {
						logout();
						navigate("/login");
					}}
					variant="subtle"
				>
					<img src={logoutIcon} alt="Logout" style={{ width: 30, height: 30 }} />
				</Button>

			</div>
			<div style={{ padding: "2rem" }}>
				<ShipTable />
			</div>
		</div>
	)
};

export default Landing;