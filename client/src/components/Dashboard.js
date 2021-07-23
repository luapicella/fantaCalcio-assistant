import { Col, Table, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Eye } from 'react-bootstrap-icons';


const Dashboard = (props) => {

    const orderFantaTeams = props.fantaTeams.sort((a, b) => {
        if (a.credits < b.credits) return 1;
        if (a.credits > b.credits) return -1;
        return 0;
    })

    const onShow = props.onShow;

    return (
        <Col className='table-inf'>
            <InfoTable
                info={orderFantaTeams}
                onShow={onShow} />
        </Col>
    );
}

function InfoTable(props) {
    const { info, onShow } = props;
    return (<>
        <Table striped bordered size="sm">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>FantaM</th>
                    <th>P</th>
                    <th>D</th>
                    <th>C</th>
                    <th>A</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {info.map(i => {
                    return (
                        <InfoRow
                            key={i.id}
                            onShow={() => onShow(i.id, i.name)}
                            info={i} />
                    );
                })}
            </tbody>
        </Table>
    </>

    );
}

const InfoRow = (props) => {
    const { info, onShow } = props
    return <tr>
        <InfoRowData info={info} />
        <RowControls onShow={onShow} />
    </tr>
}

function InfoRowData(props) {
    const { name, credits, p, d, c, a } = props.info;

    const p_compl = p === 3 ? 'completed' : '';
    const d_compl = d === 8 ? 'completed' : '';
    const c_compl = c === 8 ? 'completed' : '';
    const a_compl = a === 6 ? 'completed' : '';

    const credits_compl = credits < 0 ? 'credits-compl' : '';



    return <>
        <td width={'30%'}>{name}</td>
        <td className={credits_compl} width={'20%'}>{credits}</td>
        <td className={p_compl} width={'10%'}>{p}</td>
        <td className={d_compl} width={'10%'}>{d}</td>
        <td className={c_compl} width={'10%'}>{c}</td>
        <td className={a_compl} width={'10%'}>{a}</td>
    </>;
}

function RowControls(props) {
    const { onShow } = props

    return <td width={'10%'}>
        <Button
            className='button-eye shadow-none'
            size="sm"
            onClick={onShow}>
            <Eye />
        </Button>
    </td>
}


export default Dashboard;