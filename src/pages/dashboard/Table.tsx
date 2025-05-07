import { useEffect, useMemo, useState } from "react";
import {
    Table,
    TextInput,
    ScrollArea,
    Image,
    Text,
    Group,
    Badge,
    Center,
    UnstyledButton,
    Loader,
    Box,
    Pagination,
} from "@mantine/core";
import { FiSearch, FiChevronUp, FiChevronDown, FiMoreVertical } from 'react-icons/fi';
import { Link } from "react-router-dom";

type Ship = {
    ship_id: number;
    ship_name: string;
    ship_type: string;
    roles: string[];
    home_port: string;
    year_built: number | null;
    active: boolean;
    image: string | null;
    missions: { name: string }[];
};

type SortDirection = "asc" | "desc";
type SortableField = keyof Pick<Ship, "ship_name" | "ship_type" | "year_built"> | "missions";

const Th = ({
    label,
    sorted,
    reversed,
    onSort,
}: {
    label: string;
    sorted: boolean;
    reversed: boolean;
    onSort: () => void;
}) => (
    <UnstyledButton onClick={onSort}>
        <Group>
            <Text fw={500} fz="sm">
                {label}
            </Text>
            <Center>
                {sorted ? (
                    reversed ? (
                        <FiChevronUp size={14} />
                    ) : (
                        <FiChevronDown size={14} />
                    )
                ) : (
                    <FiMoreVertical size={14} />
                )}
            </Center>
        </Group>
    </UnstyledButton>
);

export default function ShipTable() {
    const [ships, setShips] = useState<Ship[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortableField | null>(null);
    const [reverseSort, setReverseSort] = useState(false);
    const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchShips = async () => {
            setLoading(true);
            try {
                const res = await fetch("https://api.spacexdata.com/v3/ships");
                const data = await res.json();
                setShips(data);
            } catch (err) {
                console.error("Failed to fetch ships", err);
            } finally {
                setLoading(false);
            }
        };
        fetchShips();
    }, []);

    const setSorting = (field: SortableField) => {
        const reversed = field === sortBy ? !reverseSort : false;
        setReverseSort(reversed);
        setSortBy(field);
    };

    const filteredData = useMemo(() => {
        let data = ships.filter((ship) =>
            ship.ship_name.toLowerCase().includes(search.toLowerCase())
        );

        if (sortBy) {
            data.sort((a, b) => {
                const valA = sortBy === "missions" ? a.missions.length : a[sortBy] ?? "";
                const valB = sortBy === "missions" ? b.missions.length : b[sortBy] ?? "";

                if (valA === valB) return 0;
                return reverseSort
                    ? valA > valB
                        ? -1
                        : 1
                    : valA > valB
                        ? 1
                        : -1;
            });
        }

        return data;
    }, [ships, search, sortBy, reverseSort]);

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const rows = paginatedData.map((ship) => (
        <tr key={ship.ship_name}  onClick={() => {
            setSelectedShip(ship);
            setDrawerOpened(true);
          }}>
            <td>
                <Group>
                    <Link to={`/dashboard/ships/${ship.ship_id}`}>
                        <Text fw={600} c="blue" style={{ cursor: "pointer" }}>
                            {ship.ship_name}
                        </Text>
                    </Link>
                </Group>
            </td>
            <td>{ship.ship_type}</td>
            <td>
                <Group>
                    {ship.roles.map((role) => (
                        <Badge key={role}>{role}</Badge>
                    ))}
                </Group>
            </td>
            <td>{ship.home_port}</td>
            <td>{ship.year_built ?? "N/A"}</td>
            <td>
                {ship.active ? (
                    <Badge color="green">Active</Badge>
                ) : (
                    <Badge color="gray">Inactive</Badge>
                )}
            </td>
            <td>{ship.missions.length}</td>
        </tr>
    ));

    return (
        <>
            <Center>
                <Box w={300}>
                    <TextInput
                        placeholder="Search by ship name..."
                        icon={<FiSearch size={16} />}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.currentTarget.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
                        size="sm"
                        mb="md"
                    />
                </Box>
            </Center>

            {loading ? (
                <Center>
                    <Loader />
                </Center>
            ) : (
                <div style={{ filter: drawerOpened ? "blur(4px)" : "none", transition: "0.3s" }}>
                    <ScrollArea>
                        <Table highlightOnHover withColumnBorders striped>
                            <thead>
                                <tr>
                                    <th>
                                        <Th
                                            label="Name"
                                            sorted={sortBy === "ship_name"}
                                            reversed={reverseSort}
                                            onSort={() => setSorting("ship_name")}
                                        />
                                    </th>
                                    <th>
                                        <Th
                                            label="Type"
                                            sorted={sortBy === "ship_type"}
                                            reversed={reverseSort}
                                            onSort={() => setSorting("ship_type")}
                                        />
                                    </th>
                                    <th>Roles</th>
                                    <th>Home Port</th>
                                    <th>
                                        <Th
                                            label="Year Built"
                                            sorted={sortBy === "year_built"}
                                            reversed={reverseSort}
                                            onSort={() => setSorting("year_built")}
                                        />
                                    </th>
                                    <th>Status</th>
                                    <th>
                                        <Th
                                            label="Missions"
                                            sorted={sortBy === "missions"}
                                            reversed={reverseSort}
                                            onSort={() => setSorting("missions")}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length ? (
                                    rows
                                ) : (
                                    <tr>
                                        <td colSpan={7}>
                                            <Text c="dimmed" ta="center">
                                                No ships found
                                            </Text>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </ScrollArea>

                    {filteredData.length > pageSize && (
                        <Center mt="md">
                            <Pagination
                                total={totalPages}
                                value={currentPage}
                                onChange={setCurrentPage}
                                size="sm"
                                radius="xl"
                            />
                        </Center>
                    )}
                </div>
            )}
        </>
    );
}
