// import ApexCharts from 'apexcharts';

export default class User {
	// name = '';
	// lineChartID = '';

	/**
	 * Constructor for the User class.
	 * @param {string} name - The name of the user.
	 * @param {string} lineChartID - The ID of the HTML element to render the line chart.
	 */
	constructor(userID) {
        this.userID = userID;
	}

	/**
	 * Create a line chart using ApexCharts.
	 */
	createLineChart() {
        const checkingAccount = [1300, 1400, 1320, 1480, 1520, 1630, 1580, 1660, 1720, 1790, 1750, 1830];
        const creditCardExpenses = [450, 600, 450, 400, 500, 650, 500, 450, 600, 750, 600, 550];
        const investments = [2000, 2050, 2020, 2080, 2100, 2080, 2120, 2170, 2230, 2190, 2250, 2300];
    
        const options = {
            series: [
                {
                    name: 'Checking',
                    type: 'column',
                    data: checkingAccount
                },
                {
                    name: 'Credit Card',
                    type: 'line',
                    data: creditCardExpenses
                },
                {
                    name: 'Investments',
                    type: 'area',
                    data: investments
                }
            ],
            chart: {
                height: 350,
                type: 'line',
                stacked: false,
                toolbar: {
                    show: false
                }
            },
            colors: ['#5065e3', '#ff6961', '#4ce3a1'],
            stroke: {
                width: [3, 3, 3],
                curve: 'smooth'
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                padding: {
                    left: 10,
                    right: 10
                }
            },
            fill: {
                opacity: [1, 1, 0.5],
                type: ['solid', 'solid', 'gradient'],
                gradient: {
                    shade: 'light',
                    type: 'horizontal',
                    opacityFrom: 0.75,
                    opacityTo: 0.25
                }
            },
            labels: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            xaxis: {
                type: 'category',
                labels: {
                    style: {
                        colors: '#FFFFFF'
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Amount ($)',
                    style: {
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#FFFFFF'
                    }
                },
                labels: {
                    formatter: (value) => `$${value}`,
                    style: {
                        colors: ['#FFFFFF']
                    }
                }
            },
            title: {
                text: 'Projected Financials',
                align: 'center',
                margin: 10,
                style: {
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#FFFFFF'
                }
            },
            tooltip: {
                shared: true,
                intersect: false,
                theme: 'dark',
                y: {
                    formatter: (y) => (typeof y !== 'undefined' ? `$${y.toFixed(2)}` : y),
                    style: {
                        color: '#FFFFFF'
                    }
                }
            },
            legend: {
                labels: {
                    colors: '#FFFFFF'
                }
            }
        };
        return {options : options, "chartID" : `userLineChart`};
	}
}
