import React from 'react';
import { useWindowDimensions } from '../../utils/useEffect';

const PrTable = ({ PrTableResults }) => {
    const { width } = useWindowDimensions();
    return (
        <div className="">
            {/* Repetitions Table */}
            <table border="1" style={{ width: '100%', textAlign: 'center', backgroundColor: 'white', overflowX: 'auto', marginBottom: '20px' }}
                className="table table-hover table-striped table-bordered">
                <thead className="thead-white">
                    <tr>
                        <th>{width > 700 ? 'Plage de répétition' : 'Plage'}</th>
                        <th>{width > 700 ? 'Repetitions' : 'Reps'}</th>
                        <th>Charge</th>
                        <th>Elastique</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(PrTableResults).map(category => (
                        <tr key={category}>
                            <td>{category}</td>
                            <td>{PrTableResults[category].repetitions?.value || '-'}</td>
                            <td>{PrTableResults[category].repetitions?.weightLoad || '-'}</td>
                            <td>{PrTableResults[category].repetitions?.elastic?.use} {PrTableResults[category].repetitions?.elastic?.tension || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Seconds Table */}
            <table border="1" style={{ width: '100%', textAlign: 'center', backgroundColor: 'white', overflowX: 'auto' }}
                className="table table-hover table-striped table-bordered">
                <thead className="thead-white">
                    <tr>
                        <th>{width > 700 ? 'Plage temporelle' : 'Plage'}</th>
                        <th>{width > 700 ? 'Secondes' : 'Secs'}</th>
                        <th>Charge</th>
                        <th>Elastique</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(PrTableResults).map(category => (
                        <tr key={category}>
                            <td>{category}</td>
                            <td>{PrTableResults[category].seconds?.value || '-'}</td>
                            <td>{PrTableResults[category].seconds?.weightLoad || '-'}</td>
                            <td>{PrTableResults[category].seconds?.elastic?.use} {PrTableResults[category].seconds?.elastic?.tension || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PrTable;