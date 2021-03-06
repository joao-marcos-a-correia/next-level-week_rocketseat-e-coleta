import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import api from '../../services/api';

import logo from '../../assets/logo.svg';

import './styles.css';

const CreatePoint = () => {

    interface Item {
        id: number,
        title: string,
        image_url: string;

    }

    interface IBGEUFResponse {
        sigla: string;
    }

    interface IBGECityResponse {
        nome: string;
    }


    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [initialPosition, setinitialPosition] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });


    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            setinitialPosition([latitude, longitude]);
        });
    }, [])

    useEffect(() => {
        api.get('items')
            .then(response => {
                setItems(response.data);
            });
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => {
                const ufInitials = response.data.map(uf => uf.sigla);
                setUfs(ufInitials);
            })
    }, []);

    useEffect(() => {
        if (selectedUF === '0') {
            return;
        }
        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);

                setCities(cityNames);
            });
    }, [selectedUF]);


    function HandleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUF(uf);
    };

    function HandleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    };

    function HandleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    };

    function HandleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value })
    };

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
        
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }

    }

    async function HandleSubmit(event: FormEvent) {
        event.preventDefault();
        const { name, email, whatsapp } = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude ] = selectedPosition;
        const items = selectedItems;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        };
        await api.post('points', data);

        alert('Ponto de Coleta Criado Com Sucesso !!');

        history.push('/');
    };

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    <FiArrowLeft />
                    Voltar pra Home
                </Link>
            </header>
            <form onSubmit={HandleSubmit}>
                <h1>Cadastro do <br /> ponto de Coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={HandleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={HandleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={HandleInputChange}
                            />
                        </div>
                    </div>

                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={HandleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf"> Estado (UF)</label>
                            <select
                                name="uf"
                                id="uf"
                                value={selectedUF}
                                onChange={HandleSelectUF}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key="uf" value={uf}>{uf}</option>
                                ))};
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city"> Cidade</label>
                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={HandleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))};
                            </select>
                        </div>
                    </div>

                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => {
                            return (
                                <li key={item.id}
                                    onClick={() => handleSelectItem(item.id)}
                                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                                >
                                    <img src={item.image_url} alt={item.title} />
                                    <span>{item.title}</span>
                                </li>
                            )
                        })}
                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastrar ponto de coleta
                </button>

            </form>
        </div>

    );
};

export default CreatePoint;